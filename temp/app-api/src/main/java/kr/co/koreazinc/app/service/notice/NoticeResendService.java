package kr.co.koreazinc.app.service.notice;

import kr.co.koreazinc.temp.model.entity.notice.NoticeBase;
import kr.co.koreazinc.temp.model.entity.notice.NoticeDeliveryLog;
import kr.co.koreazinc.temp.repository.notice.NoticeBaseRepository;
import kr.co.koreazinc.temp.repository.notice.NoticeDeliveryLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 공지 재발송 서비스
 * 위치: temp/app-api/src/main/java/kr/co/koreazinc/app/service/notice/NoticeResendService.java
 * 
 * 기능:
 * - 실패한 공지 재발송
 * - 발송 이력 추적
 * - 재발송 통계
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class NoticeResendService {
    
    private final NoticeBaseRepository noticeBaseRepository;
    private final NoticeDeliveryLogRepository deliveryLogRepository;
    private final NoticeMailService mailService;
    
    /**
     * 단일 공지 재발송
     */
    @Transactional
    public void resendNotice(Long noticeId, String requestedBy) {
        log.info("🔄 공지 재발송 시작: noticeId={}, requestedBy={}", noticeId, requestedBy);
        
        try {
            // 1. 공지 조회
            NoticeBase notice = noticeBaseRepository.findById(noticeId)
                .orElseThrow(() -> new RuntimeException("공지를 찾을 수 없습니다: " + noticeId));
            
            // 2. 기존 발송 이력 확인
            NoticeDeliveryLog lastLog = deliveryLogRepository.findTopByNoticeIdOrderByDeliveryIdDesc(noticeId)
                .orElse(null);
            
            if (lastLog != null) {
                log.info("📊 이전 발송 이력: status={}, attempt={}, error={}", 
                    lastLog.getDeliveryStatus(), 
                    lastLog.getAttemptCount(),
                    lastLog.getLastError());
            }
            
            // 3. 공지 상태를 APPROVED로 변경 (재발송 가능 상태)
            if ("FAILED".equals(notice.getNoticeStatus()) || "SENT".equals(notice.getNoticeStatus())) {
                notice.setNoticeStatus("APPROVED");
                notice.setUpdatedBy(requestedBy);
                noticeBaseRepository.save(notice);
            }
            
            // 4. 메일 재발송
            mailService.sendNoticeEmail(noticeId);
            
            log.info(" 공지 재발송 완료: noticeId={}", noticeId);
            
        } catch (Exception e) {
            log.error(" 공지 재발송 실패: noticeId={}, error={}", noticeId, e.getMessage(), e);
            throw new RuntimeException("공지 재발송 실패: " + e.getMessage(), e);
        }
    }
    
    /**
     * 실패한 공지 목록 조회
     */
    @Transactional(readOnly = true)
    public Page<NoticeBase> getFailedNotices(Pageable pageable) {
        return noticeBaseRepository.findAll(
            (root, query, cb) -> cb.equal(root.get("noticeStatus"), "FAILED"),
            pageable
        );
    }
    
    /**
     * 특정 기간 내 실패한 공지 조회
     */
    @Transactional(readOnly = true)
    public List<NoticeBase> getFailedNoticesBetween(LocalDateTime startDate, LocalDateTime endDate) {
        return noticeBaseRepository.findAll(
            (root, query, cb) -> cb.and(
                cb.equal(root.get("noticeStatus"), "FAILED"),
                cb.between(root.get("createdAt"), startDate, endDate)
            )
        );
    }
    
    /**
     * 발송 이력 조회
     */
    @Transactional(readOnly = true)
    public List<NoticeDeliveryLog> getDeliveryHistory(Long noticeId) {
        return deliveryLogRepository.findByNoticeIdOrderByDeliveryIdDesc(noticeId);
    }
    
    /**
     * 재발송 가능 여부 확인
     */
    @Transactional(readOnly = true)
    public boolean canResend(Long noticeId) {
        NoticeBase notice = noticeBaseRepository.findById(noticeId).orElse(null);
        if (notice == null) {
            return false;
        }
        
        // 승인된 공지이거나, 실패한 공지는 재발송 가능
        return "APPROVED".equals(notice.getNoticeStatus()) || 
               "FAILED".equals(notice.getNoticeStatus());
    }
    
    /**
     * 재발송 통계
     */
    @Transactional(readOnly = true)
    public ResendStatistics getResendStatistics(LocalDateTime startDate, LocalDateTime endDate) {
        List<NoticeDeliveryLog> logs = deliveryLogRepository.findAll();
        
        long totalFailed = logs.stream()
            .filter(log -> "FAILED".equals(log.getDeliveryStatus()))
            .count();
        
        long totalResent = logs.stream()
            .filter(log -> log.getAttemptCount() > 1)
            .count();
        
        long successAfterResend = logs.stream()
            .filter(log -> log.getAttemptCount() > 1 && "SENT".equals(log.getDeliveryStatus()))
            .count();
        
        return ResendStatistics.builder()
            .totalFailed(totalFailed)
            .totalResent(totalResent)
            .successAfterResend(successAfterResend)
            .failureRate(totalFailed > 0 ? (double) totalFailed / logs.size() * 100 : 0)
            .resendSuccessRate(totalResent > 0 ? (double) successAfterResend / totalResent * 100 : 0)
            .build();
    }
    
    /**
     * 재발송 통계 DTO
     */
    @lombok.Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class ResendStatistics {
        private Long totalFailed;           // 전체 실패 건수
        private Long totalResent;           // 재발송 시도 건수
        private Long successAfterResend;    // 재발송 후 성공 건수
        private Double failureRate;         // 실패율 (%)
        private Double resendSuccessRate;   // 재발송 성공률 (%)
    }
}