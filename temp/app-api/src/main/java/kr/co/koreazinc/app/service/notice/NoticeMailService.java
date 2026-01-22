package kr.co.koreazinc.app.service.notice;

import kr.co.koreazinc.app.configuration.MailTestProperty;
import kr.co.koreazinc.spring.model.MailInfo;
import kr.co.koreazinc.spring.security.property.OAuth2Property;
import kr.co.koreazinc.spring.utility.MailUtils;
import kr.co.koreazinc.temp.model.entity.notice.*;
import kr.co.koreazinc.temp.repository.notice.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 공지 메일 발송 서비스 (테스트 모드 적용)
 * 위치: temp/app-api/src/main/java/kr/co/koreazinc/app/service/notice/NoticeMailService.java
 * 
 * 기능:
 * 1. 발송 대상자 조회 (법인/부서 → 사용자 이메일)
 * 2. 메일 발송 (spring-core MailUtils 활용)
 * 3. 발송 이력 저장
 * 4. 수신자 기록 저장
 * 5.  테스트 모드 지원 (실수 발송 방지)
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class NoticeMailService {
    
    private final NoticeBaseRepository noticeBaseRepository;
    private final NoticeTargetRepository noticeTargetRepository;
    private final NoticeAttachmentRepository noticeAttachmentRepository;
    private final NoticeSendPlanRepository sendPlanRepository;
    private final NoticeDeliveryLogRepository deliveryLogRepository;
    private final NoticeRecipientRepository recipientRepository;
    private final UserMasterRepository userMasterRepository;
    private final CorporationMasterRepository corporationMasterRepository;
    private final OrganizationMasterRepository organizationMasterRepository;
    
    private final OAuth2Property oauth2Property;
    private final MailTestProperty mailTestProperty;  //  테스트 설정 추가
    
    /**
     * 단일 공지 메일 발송
     */
    @Transactional
    public void sendNoticeEmail(Long noticeId) {
        log.info(" 메일 발송 시작: noticeId={}", noticeId);
        
        try {
            // 1. 공지 정보 조회
            NoticeBase notice = noticeBaseRepository.findById(noticeId)
                .orElseThrow(() -> new RuntimeException("공지를 찾을 수 없습니다: " + noticeId));
            
            // 2. 발송 가능 상태 확인 (APPROVED만 발송)
            if (!"APPROVED".equals(notice.getNoticeStatus())) {
                log.warn(" 승인된 공지만 발송 가능합니다: noticeId={}, status={}", 
                    noticeId, notice.getNoticeStatus());
                return;
            }
            
            // 3. 중복 발송 방지 확인
            String idempotencyKey = generateIdempotencyKey(noticeId);
            Optional<NoticeDeliveryLog> existingLog = deliveryLogRepository.findByIdempotencyKey(idempotencyKey);
            if (existingLog.isPresent() && "SENT".equals(existingLog.get().getDeliveryStatus())) {
                log.warn(" 이미 발송된 공지입니다: noticeId={}", noticeId);
                return;
            }
            
            // 4. 발송 이력 생성 (READY 상태)
            NoticeDeliveryLog deliveryLog = NoticeDeliveryLog.builder()
                .noticeId(noticeId)
                .channel(NoticeDeliveryLog.Channel.OUTLOOK_MAIL)
                .deliveryStatus(NoticeDeliveryLog.DeliveryStatus.READY)
                .attemptCount(0)
                .idempotencyKey(idempotencyKey)
                .build();
            deliveryLog = deliveryLogRepository.save(deliveryLog);
            
            // 5. 수신 대상자 조회
            Set<String> recipientEmails = getRecipientEmails(noticeId);
            if (recipientEmails.isEmpty()) {
                log.warn(" 수신 대상자가 없습니다: noticeId={}", noticeId);
                updateDeliveryLog(deliveryLog, "FAILED", "수신 대상자가 없습니다");
                return;
            }
            
            //  6. 화이트리스트 필터링 (설정된 경우)
            Set<String> originalRecipients = new HashSet<>(recipientEmails);
            if (mailTestProperty.getWhitelistMode() && 
                mailTestProperty.getWhitelistEmails() != null && 
                !mailTestProperty.getWhitelistEmails().isEmpty()) {
                
                recipientEmails = recipientEmails.stream()
                    .filter(email -> mailTestProperty.getWhitelistEmails().contains(email))
                    .collect(Collectors.toSet());
                
                log.info(" 화이트리스트 모드: 원본 {}명 → 필터링 후 {}명", 
                    originalRecipients.size(), recipientEmails.size());
                
                if (recipientEmails.isEmpty()) {
                    log.warn(" 화이트리스트에 해당하는 수신자가 없습니다");
                    updateDeliveryLog(deliveryLog, "FAILED", "화이트리스트에 해당하는 수신자가 없습니다");
                    return;
                }
            }
            
            // 7. 발신자 정보 조회 (notice 저장값 우선)
            String senderEmail = notice.getSenderEmail();
            if (senderEmail == null || senderEmail.isBlank()) {
                senderEmail = getUserEmail(notice.getCreatedBy());
            }
            if (senderEmail == null) {
                log.warn(" 발신자 이메일을 찾을 수 없습니다: userId={}", notice.getCreatedBy());
                updateDeliveryLog(deliveryLog, "FAILED", "발신자 이메일을 찾을 수 없습니다");
                return;
            }
            
            // 8. 승인자 정보 조회 (참조용)
            String approverEmail = getUserEmail(notice.getUpdatedBy());
            
            // 9. 첨부파일 조회
            List<File> attachments = getAttachmentFiles(noticeId);
            
            // 10. 메일 정보 구성
            MailInfo mailInfo = MailInfo.builder()
                .sender(senderEmail)
                .from(senderEmail)
                .to(recipientEmails)
                .cc(approverEmail != null ? Set.of(approverEmail) : new HashSet<>())
                .subject(notice.getMailSubject() != null ? notice.getMailSubject() : notice.getTitle())
                .content(buildEmailContent(notice))
                .attachments(new HashSet<>(attachments))
                .build();
            
            //  11. 테스트 모드 확인 및 메일 발송 
            if (mailTestProperty.getTestMode()) {
                //  테스트 모드: 실제 발송 안함, 로그만 출력
                logMailInfoForTest(mailInfo, notice, originalRecipients, recipientEmails);
                log.warn(" [테스트 모드] 실제 메일은 발송되지 않았습니다 ");
                
            } else {
                //  실제 발송 모드
                log.info(" [실제 발송] 메일 발송 실행 중...");
                MailUtils.remoteSend(oauth2Property.getCredential("message"), mailInfo);
                log.info(" [실제 발송] 메일 발송 완료");
            }
            
            // 12. 발송 성공 처리
            updateDeliveryLog(deliveryLog, "SENT", null);
            
            // 13. 수신자 기록 저장
            saveRecipients(noticeId, recipientEmails);
            
            // 14. 공지 상태 업데이트
            notice.setNoticeStatus("SENT");
            noticeBaseRepository.save(notice);
            
            log.info(" 메일 발송 완료: noticeId={}, recipients={}", noticeId, recipientEmails.size());
            
        } catch (Exception e) {
            log.error(" 메일 발송 실패: noticeId={}, error={}", noticeId, e.getMessage(), e);
            
            // 발송 실패 처리
            deliveryLogRepository.findByIdempotencyKey(generateIdempotencyKey(noticeId))
                .ifPresent(log -> {
                    log.setDeliveryStatus("FAILED");
                    log.setLastError(e.getMessage());
                    log.setAttemptCount(log.getAttemptCount() + 1);
                    deliveryLogRepository.save(log);
                });
            
            throw new RuntimeException("메일 발송 실패: " + e.getMessage(), e);
        }
    }
    
    /**
     *  테스트 모드용 메일 정보 로깅
     */
    private void logMailInfoForTest(MailInfo mailInfo, NoticeBase notice, 
                                     Set<String> originalRecipients, Set<String> filteredRecipients) {
        
        log.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        log.info(" [테스트 모드] 메일 발송 정보");
        log.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        
        // 공지 기본 정보
        log.info("📋 공지 ID: {}", notice.getNoticeId());
        log.info("📋 공지 제목: {}", notice.getTitle());
        log.info("📋 중요도: {}", notice.getNoticeLevel());
        log.info("📋 공지 상태: {}", notice.getNoticeStatus());
        
        // 발신자 정보
        log.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        log.info("👤 발신자 (FROM): {}", mailInfo.getFrom());
        log.info("👤 발신자 (SENDER): {}", mailInfo.getSender());
        
        // 수신자 정보
        log.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        if (mailTestProperty.getWhitelistMode()) {
            log.info(" 원본 수신자 (TO): {} 명", originalRecipients.size());
            log.info(" 원본 수신자 목록:");
            originalRecipients.forEach(email -> log.info("   - {}", email));
            log.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            log.info(" 필터링 후 수신자 (TO): {} 명", filteredRecipients.size());
            log.info(" 필터링 후 수신자 목록:");
        } else {
            log.info(" 수신자 (TO): {} 명", mailInfo.getTo().size());
            log.info(" 수신자 목록:");
        }
        mailInfo.getTo().forEach(email -> log.info("   ✉️ {}", email));
        
        // 참조 정보
        log.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        if (mailInfo.getCc() != null && !mailInfo.getCc().isEmpty()) {
            log.info(" 참조 (CC): {} 명", mailInfo.getCc().size());
            mailInfo.getCc().forEach(email -> log.info("   📋 {}", email));
        } else {
            log.info(" 참조 (CC): 없음");
        }
        
        // 메일 내용
        log.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        log.info("📝 제목: {}", mailInfo.getSubject());
        log.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        log.info("📄 본문 내용 (처음 500자):");
        String content = mailInfo.getContent();
        if (content.length() > 500) {
            log.info("{}", content.substring(0, 500) + "...");
        } else {
            log.info("{}", content);
        }
        
        // 첨부파일
        log.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        if (mailInfo.getAttachments() != null && !mailInfo.getAttachments().isEmpty()) {
            log.info(" 첨부파일: {} 개", mailInfo.getAttachments().size());
            mailInfo.getAttachments().forEach(file -> 
                log.info("   📄 {} ({} bytes)", file.getName(), file.length())
            );
        } else {
            log.info(" 첨부파일: 없음");
        }
        
        log.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        log.warn(" 테스트 모드이므로 실제 메일은 발송되지 않았습니다!");
        log.warn(" 실제 발송을 원하시면 application.yaml에서");
        log.warn(" notice.mail.test-mode: false 로 설정하세요");
        log.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    }
    
    /**
     * 수신 대상자 이메일 조회
     * NoticeTarget (법인/부서) → UserMaster → 이메일 수집
     */
    private Set<String> getRecipientEmails(Long noticeId) {
        Set<String> emails = new HashSet<>();
        
        List<NoticeTarget> targets = noticeTargetRepository.findByNoticeId(noticeId);
        
        for (NoticeTarget target : targets) {
            switch (target.getTargetType()) {
                case "CORP" -> {
                    // 법인 전체 사용자 조회
                    Long corpId = Long.parseLong(target.getTargetKey());
                    List<UserMaster> corpUsers = userMasterRepository.findByCorpIdAndIsActiveTrue(corpId);
                    emails.addAll(extractEmails(corpUsers));
                }
                case "ORG_UNIT" -> {
                    // 부서 전체 사용자 조회
                    Long orgUnitId = Long.parseLong(target.getTargetKey());
                    List<UserMaster> orgUsers = userMasterRepository.findByOrgUnitIdAndIsActiveTrue(orgUnitId);
                    emails.addAll(extractEmails(orgUsers));
                }
                case "USER" -> {
                    // 개별 사용자
                    String email = getUserEmail(target.getTargetKey());
                    if (email != null) {
                        emails.add(email);
                    }
                }
            }
        }
        
        log.info("📬 수신 대상자 수집 완료: noticeId={}, count={}", noticeId, emails.size());
        return emails;
    }
    
    /**
     * 사용자 이메일 조회
     */
    private String getUserEmail(String userId) {
        return userMasterRepository.findById(userId)
            .map(UserMaster::getEmail)
            .orElse(null);
    }

    private String getUserName(String userId) {
        if (userId == null || userId.isBlank()) return null;
        return userMasterRepository.findById(userId)
            .map(user -> {
                if (user.getUserKoNm() != null && !user.getUserKoNm().isBlank()) {
                    return user.getUserKoNm();
                }
                return user.getUserEnNm();
            })
            .orElse(null);
    }
    
    /**
     * 사용자 목록에서 이메일 추출
     */
    private Set<String> extractEmails(List<UserMaster> users) {
        return users.stream()
            .map(UserMaster::getEmail)
            .filter(Objects::nonNull)
            .filter(email -> !email.isBlank())
            .collect(Collectors.toSet());
    }
    
    /**
     * 첨부파일 File 객체 리스트 생성
     */
    private List<File> getAttachmentFiles(Long noticeId) {
        List<NoticeAttachment> attachments = noticeAttachmentRepository.findByNoticeIdOrderByUploadedAtAsc(noticeId);
        
        return attachments.stream()
            .map(att -> new File(att.getFilePath()))
            .filter(File::exists)
            .collect(Collectors.toList());
    }
    
    /**
     * 이메일 본문 생성 (HTML)
     */
    private String buildEmailContent(NoticeBase notice) {
        StringBuilder html = new StringBuilder();
        
        html.append("<html><body style='font-family: Arial, sans-serif;'>");
        html.append("<h2 style='color: #1e40af;'>").append(escapeHtml(notice.getTitle())).append("</h2>");
        html.append("<hr style='border: 1px solid #e5e7eb;'>");
        
        // 공지 레벨 표시
        html.append("<p><strong>중요도:</strong> ");
        switch (notice.getNoticeLevel()) {
            case L1 -> html.append("<span style='color: #3b82f6;'>일반</span>");
            case L2 -> html.append("<span style='color: #f59e0b;'>중요</span>");
            case L3 -> html.append("<span style='color: #ef4444;'>긴급</span>");
        }
        html.append("</p>");
        
        // 발신 정보
        String senderDept = notice.getSenderOrgUnitName();
        String creatorId = notice.getCreatedBy();
        String creatorName = getUserName(creatorId);
        String approverId = notice.getUpdatedBy();
        String approverName = getUserName(approverId);
        String approverEmail = getUserEmail(approverId);

        if (senderDept != null && !senderDept.isBlank()) {
            html.append("<p><strong>발신:</strong> ").append(escapeHtml(senderDept)).append("</p>");
        }
        if (creatorId != null && !creatorId.isBlank()) {
            String creatorLabel = creatorName != null && !creatorName.isBlank()
                ? String.format("%s (%s)", creatorName, creatorId)
                : creatorId;
            html.append("<p><strong>등록자:</strong> ").append(escapeHtml(creatorLabel)).append("</p>");
        }
        if (approverId != null && !approverId.isBlank()) {
            String approverLabel;
            if (approverEmail != null && !approverEmail.isBlank()) {
                approverLabel = approverName != null && !approverName.isBlank()
                    ? String.format("%s (%s)", approverName, approverEmail)
                    : approverEmail;
            } else {
                approverLabel = approverName != null && !approverName.isBlank()
                    ? String.format("%s (%s)", approverName, approverId)
                    : approverId;
            }
            html.append("<p><strong>참조:</strong> ").append(escapeHtml(approverLabel)).append("</p>");
        }
        
        html.append("<hr style='border: 1px solid #e5e7eb;'>");
        
        // 본문
        html.append("<div style='margin-top: 20px; line-height: 1.6;'>");
        html.append(notice.getContent().replace("\n", "<br>"));
        html.append("</div>");
        
        html.append("</body></html>");
        
        return html.toString();
    }
    
    /**
     * HTML 특수문자 이스케이프
     */
    private String escapeHtml(String text) {
        if (text == null) return "";
        return text.replace("&", "&amp;")
                   .replace("<", "&lt;")
                   .replace(">", "&gt;")
                   .replace("\"", "&quot;")
                   .replace("'", "&#x27;");
    }
    
    /**
     * 날짜 포맷팅
     */
    private String formatDateTime(LocalDateTime dateTime) {
        return dateTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
    }
    
    /**
     * 발송 이력 업데이트
     */
    private void updateDeliveryLog(NoticeDeliveryLog log, String status, String error) {
        log.setDeliveryStatus(status);
        if ("SENT".equals(status)) {
            log.setSentAt(LocalDateTime.now());
        }
        if (error != null) {
            log.setLastError(error);
        }
        log.setAttemptCount(log.getAttemptCount() + 1);
        deliveryLogRepository.save(log);
    }
    
    /**
     * 수신자 기록 저장
     */
    private void saveRecipients(Long noticeId, Set<String> emails) {
        LocalDateTime now = LocalDateTime.now();
        
        List<NoticeRecipient> recipients = emails.stream()
            .map(email -> {
                // 이메일로 사용자 ID 찾기
                String userId = userMasterRepository.findAll().stream()
                    .filter(u -> email.equals(u.getEmail()))
                    .map(UserMaster::getUserId)
                    .findFirst()
                    .orElse(email); // 못 찾으면 이메일을 ID로 사용
                
                return NoticeRecipient.builder()
                    .noticeId(noticeId)
                    .userId(userId)
                    .sentAt(now)
                    .isRead(false)
                    .build();
            })
            .collect(Collectors.toList());
        
        recipientRepository.saveAll(recipients);
        log.info("📝 수신자 기록 저장 완료: count={}", recipients.size());
    }
    
    /**
     * Idempotency Key 생성 (중복 발송 방지)
     */
    private String generateIdempotencyKey(Long noticeId) {
        return "notice_" + noticeId + "_" + LocalDateTime.now().format(
            DateTimeFormatter.ofPattern("yyyyMMddHHmm")
        );
    }
}
