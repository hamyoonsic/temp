package kr.co.koreazinc.app.service.notice;

import kr.co.koreazinc.app.configuration.MailTestProperty;
import kr.co.koreazinc.spring.security.property.OAuth2Property;
import kr.co.koreazinc.spring.utility.OAuthUtils;
import kr.co.koreazinc.temp.model.entity.notice.*;
import kr.co.koreazinc.temp.repository.notice.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Outlook 캘린더 연동 서비스 (테스트 모드 적용)
 * 위치: temp/app-api/src/main/java/kr/co/koreazinc/app/service/notice/OutlookCalendarService.java
 * 
 * Graph API를 통한 Outlook 캘린더 이벤트 생성
 *  테스트 모드 지원 (실수 이벤트 생성 방지)
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class OutlookCalendarService {
    
    private final NoticeBaseRepository noticeBaseRepository;
    private final NoticeTargetRepository noticeTargetRepository;
    private final NoticeCalendarEventRepository calendarEventRepository;
    private final UserMasterRepository userMasterRepository;
    
    private final OAuth2Property oauth2Property;
    private final MailTestProperty mailTestProperty;  //  테스트 설정 추가
    
    private static final String GRAPH_API_BASE = "https://graph.microsoft.com/v1.0";
    
    /**
     * Outlook 캘린더 이벤트 생성
     */
    @Transactional
    public String createCalendarEvent(Long noticeId, LocalDateTime eventStartAt, LocalDateTime eventEndAt) {
        log.info(" Outlook calendar event create: noticeId={}", noticeId);

        try {
            NoticeBase notice = noticeBaseRepository.findById(noticeId)
                .orElseThrow(() -> new RuntimeException("Notice not found: " + noticeId));

            List<String> attendeeEmails = getAttendeeEmails(noticeId);
            if (attendeeEmails.isEmpty()) {
                log.warn(" No attendees for calendar event: noticeId={}", noticeId);
                return null;
            }

            String token = null;
            if (!mailTestProperty.getCalendarTestMode()) {
                OAuth2Property.Credential microsoftCredential = oauth2Property.getCredential("microsoft");
                token = OAuthUtils.issuedToken(
                    microsoftCredential.getTokenUrl(),
                    microsoftCredential.getClientId(),
                    microsoftCredential.getClientSecret(),
                    microsoftCredential.getScope()
                );
            }

            String lastEventId = null;
            for (String mailboxEmail : attendeeEmails) {
                if (calendarEventRepository.findByNoticeIdAndResourceMailbox(noticeId, mailboxEmail).isPresent()) {
                    continue;
                }

                Map<String, Object> eventBody = buildEventRequestBody(notice, eventStartAt, eventEndAt, List.of());
                String eventId;

                if (mailTestProperty.getCalendarTestMode()) {
                    logCalendarEventForTest(notice, eventStartAt, eventEndAt, List.of(mailboxEmail), mailboxEmail, eventBody);
                    eventId = "TEST_EVENT_" + UUID.randomUUID().toString();
                } else {
                    Map<String, Object> response = WebClient.builder()
                        .baseUrl(GRAPH_API_BASE)
                        .build()
                        .post()
                        .uri("/users/" + mailboxEmail + "/events")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(eventBody)
                        .retrieve()
                        .bodyToMono(Map.class)
                        .block();

                    eventId = response != null ? (String) response.get("id") : null;
                    log.info(" Calendar event created: mailbox={}", mailboxEmail);
                }

                NoticeCalendarEvent calendarEvent = NoticeCalendarEvent.builder()
                    .noticeId(noticeId)
                    .eventSubject(notice.getTitle())
                    .eventBody(notice.getContent())
                    .eventStartAt(eventStartAt)
                    .eventEndAt(eventEndAt)
                    .attendees(String.join(";", attendeeEmails))
                    .resourceMailbox(mailboxEmail)
                    .providerEventId(eventId)
                    .build();

                calendarEventRepository.save(calendarEvent);
                lastEventId = eventId;
            }

            return lastEventId;

        } catch (Exception e) {
            log.error(" Outlook calendar event create failed: noticeId={}, error={}", noticeId, e.getMessage(), e);
            throw new RuntimeException("Calendar event create failed: " + e.getMessage(), e);
        }
    }

    private void logCalendarEventForTest(
            NoticeBase notice, 
            LocalDateTime startAt, 
            LocalDateTime endAt,
            List<String> attendeeEmails, 
            String senderEmail,
            Map<String, Object> eventBody) {
        
        log.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        log.info(" [캘린더 테스트 모드] Outlook 이벤트 생성 정보");
        log.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        
        // 공지 기본 정보
        log.info("📋 공지 ID: {}", notice.getNoticeId());
        log.info("📋 공지 제목: {}", notice.getTitle());
        log.info("📋 중요도: {}", notice.getNoticeLevel());
        
        // 이벤트 정보
        log.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        log.info("📅 이벤트 제목: {}", eventBody.get("subject"));
        log.info("📅 시작 시간: {}", formatDateTime(startAt));
        log.info("📅 종료 시간: {}", formatDateTime(endAt));
        log.info("📅 시간대: Asia/Seoul");
        
        // 주최자 정보
        log.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        log.info("👤 주최자 (Organizer): {}", senderEmail);
        log.info("👤 캘린더 소유자: {}", senderEmail);
        
        // 참석자 정보
        log.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        log.info("👥 참석자 (Attendees): {} 명", attendeeEmails.size());
        log.info("👥 참석자 목록:");
        attendeeEmails.forEach(email -> log.info("    {}", email));
        
        // 이벤트 본문
        log.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        Map<String, Object> bodyContent = (Map<String, Object>) eventBody.get("body");
        String content = (String) bodyContent.get("content");
        log.info("📄 이벤트 본문 (처음 500자):");
        if (content.length() > 500) {
            log.info("{}", content.substring(0, 500) + "...");
        } else {
            log.info("{}", content);
        }
        
        // 알림 설정
        log.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        if (eventBody.containsKey("isReminderOn") && (Boolean) eventBody.get("isReminderOn")) {
            log.info("⏰ 알림: 15분 전");
        } else {
            log.info("⏰ 알림: 없음");
        }
        
        // Graph API 엔드포인트
        log.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        log.info("🔗 Graph API 엔드포인트:");
        log.info("   POST {}/users/{}/events", GRAPH_API_BASE, senderEmail);
        
        log.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        log.warn(" 캘린더 테스트 모드이므로 실제 이벤트는 생성되지 않았습니다!");
        log.warn(" 실제 이벤트 생성을 원하시면 application.yaml에서");
        log.warn(" notice.mail.calendar-test-mode: false 로 설정하세요");
        log.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    }
    
    /**
     * Graph API 이벤트 요청 본문 구성
     */
    private Map<String, Object> buildEventRequestBody(
            NoticeBase notice, 
            LocalDateTime startAt, 
            LocalDateTime endAt,
            List<String> attendeeEmails) {
        
        Map<String, Object> event = new HashMap<>();
        
        // 제목
        event.put("subject", notice.getTitle());
        
        // 본문 (HTML 형태)
        Map<String, Object> body = new HashMap<>();
        body.put("contentType", "HTML");
        body.put("content", buildEventHtmlContent(notice));
        event.put("body", body);
        
        // 시작 시간
        Map<String, String> start = new HashMap<>();
        start.put("dateTime", startAt.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        start.put("timeZone", "Asia/Seoul");
        event.put("start", start);
        
        // 종료 시간
        Map<String, String> end = new HashMap<>();
        end.put("dateTime", endAt.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        end.put("timeZone", "Asia/Seoul");
        event.put("end", end);
        
        // 참석자
        List<Map<String, Object>> attendees = attendeeEmails.stream()
            .map(email -> {
                Map<String, Object> attendee = new HashMap<>();
                Map<String, String> emailAddress = new HashMap<>();
                emailAddress.put("address", email);
                attendee.put("emailAddress", emailAddress);
                attendee.put("type", "required");
                return attendee;
            })
            .collect(Collectors.toList());
        event.put("attendees", attendees);
        
        // 알림 설정 (15분 전)
        event.put("isReminderOn", true);
        event.put("reminderMinutesBeforeStart", 15);
        
        return event;
    }
    
    /**
     * 이벤트 HTML 본문 생성
     */
    private String buildEventHtmlContent(NoticeBase notice) {
        StringBuilder html = new StringBuilder();
        
        html.append("<html><body style='font-family: Arial, sans-serif;'>");
        html.append("<h2 style='color: #1e40af;'>").append(escapeHtml(notice.getTitle())).append("</h2>");
        html.append("<hr style='border: 1px solid #e5e7eb;'>");
        
        // 중요도 표시
        html.append("<p><strong>중요도:</strong> ");
        switch (notice.getNoticeLevel()) {
            case L1 -> html.append("<span style='color: #3b82f6;'>🔵 일반</span>");
            case L2 -> html.append("<span style='color: #f59e0b;'>🟠 중요</span>");
            case L3 -> html.append("<span style='color: #ef4444;'>🔴 긴급</span>");
        }
        html.append("</p>");
        
        // 발신 부서
        if (notice.getSenderOrgUnitName() != null) {
            html.append("<p><strong>발신:</strong> ").append(escapeHtml(notice.getSenderOrgUnitName())).append("</p>");
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
     * 참석자 이메일 목록 조회 (메일 수신자와 동일한 로직)
     */
    private List<String> getAttendeeEmails(Long noticeId) {
        Set<String> emails = new HashSet<>();
        
        List<NoticeTarget> targets = noticeTargetRepository.findByNoticeId(noticeId);
        
        for (NoticeTarget target : targets) {
            switch (target.getTargetType()) {
                case "CORP" -> {
                    Long corpId = Long.parseLong(target.getTargetKey());
                    List<UserMaster> corpUsers = userMasterRepository.findByCorpIdAndIsActiveTrue(corpId);
                    emails.addAll(extractEmails(corpUsers));
                }
                case "ORG_UNIT" -> {
                    Long orgUnitId = Long.parseLong(target.getTargetKey());
                    List<UserMaster> orgUsers = userMasterRepository.findByOrgUnitIdAndIsActiveTrue(orgUnitId);
                    emails.addAll(extractEmails(orgUsers));
                }
                case "USER" -> {
                    String email = getUserEmail(target.getTargetKey());
                    if (email != null) {
                        emails.add(email);
                    }
                }
            }
        }
        
        log.info("📬 캘린더 참석자 수집 완료: noticeId={}, count={}", noticeId, emails.size());
        return new ArrayList<>(emails);
    }
    
    /**
     * 사용자 이메일 조회
     */
    private String getUserEmail(String userId) {
        return userMasterRepository.findById(userId)
            .map(UserMaster::getEmail)
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
}