package kr.co.koreazinc.app.scheduler;

import kr.co.koreazinc.app.service.notice.NoticeMailService;
import kr.co.koreazinc.temp.model.entity.notice.NoticeBase;
import kr.co.koreazinc.temp.model.entity.notice.NoticeSendPlan;
import kr.co.koreazinc.temp.repository.notice.NoticeBaseRepository;
import kr.co.koreazinc.temp.repository.notice.NoticeSendPlanRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * 공지 메일 발송 스케줄러
 * 위치: temp/app-api/src/main/java/kr/co/koreazinc/app/scheduler/NoticeMailScheduler.java
 * 
 * 발송 시간대:
 * - 오전 정기발송: 09:00 (KST)
 * - 오후 정기발송: 13:00, 17:00 (KST)
 * 
 * 실행 주기: 매일 09:00, 13:00, 17:00 정각
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class NoticeMailScheduler {
    
    private final NoticeSendPlanRepository sendPlanRepository;
    private final NoticeBaseRepository noticeBaseRepository;
    private final NoticeMailService mailService;
    
    /**
     * 정기 발송 스케줄러
     * Cron: 0 0 9,13,17 * * ? (매일 9시, 13시, 17시 정각)
     */
    @Scheduled(cron = "0 * * * * ?", zone = "Asia/Seoul")
    public void sendScheduledNotices() {
        LocalDateTime now = LocalDateTime.now();
        log.info("[SCHEDULED] dispatch tick: {}", now.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));

        try {
            List<NoticeSendPlan> plans = sendPlanRepository.findDueScheduledPlans(now);

            if (plans.isEmpty()) {
                return;
            }

            int successCount = 0;
            int failCount = 0;

            for (NoticeSendPlan plan : plans) {
                try {
                    NoticeBase notice = noticeBaseRepository.findById(plan.getNoticeId()).orElse(null);
                    if (notice == null) {
                        log.warn("[SCHEDULED] notice missing. planId={}, noticeId={}", plan.getSendPlanId(), plan.getNoticeId());
                        sendPlanRepository.delete(plan);
                        continue;
                    }

                    if (!"APPROVED".equals(notice.getNoticeStatus())) {
                        continue;
                    }

                    mailService.sendNoticeEmail(plan.getNoticeId());
                    sendPlanRepository.delete(plan);
                    successCount++;

                } catch (Exception e) {
                    log.error("[SCHEDULED] send failed: noticeId={}, error={}", plan.getNoticeId(), e.getMessage(), e);
                    failCount++;
                }
            }

            log.info("[SCHEDULED] done: success={}, fail={}, total={}", successCount, failCount, plans.size());

        } catch (Exception e) {
            log.error("[SCHEDULED] scheduler error: {}", e.getMessage(), e);
        }
    }


    /**
     * 즉시 발송 스케줄러 (1분마다 체크)
     * Cron: 0 * * * * ? (매 분 0초)
     */
    @Scheduled(cron = "0 * * * * ?", zone = "Asia/Seoul")
    public void sendImmediateNotices() {
        try {
            List<NoticeSendPlan> immediatePlans = sendPlanRepository.findBySendMode(NoticeSendPlan.SendMode.IMMEDIATE);

            if (immediatePlans.isEmpty()) {
                return;
            }

            log.info("[IMMEDIATE] plans: {}", immediatePlans.size());

            for (NoticeSendPlan plan : immediatePlans) {
                try {
                    NoticeBase notice = noticeBaseRepository.findById(plan.getNoticeId()).orElse(null);
                    if (notice == null) {
                        log.warn("[IMMEDIATE] notice missing. planId={}, noticeId={}", plan.getSendPlanId(), plan.getNoticeId());
                        sendPlanRepository.delete(plan);
                        continue;
                    }

                    if (!"APPROVED".equals(notice.getNoticeStatus())) {
                        continue;
                    }

                    mailService.sendNoticeEmail(plan.getNoticeId());
                    sendPlanRepository.delete(plan);

                } catch (Exception e) {
                    log.error("[IMMEDIATE] send failed: noticeId={}, error={}", plan.getNoticeId(), e.getMessage(), e);
                }
            }

        } catch (Exception e) {
            log.error("[IMMEDIATE] scheduler error: {}", e.getMessage(), e);
        }
    }
}

