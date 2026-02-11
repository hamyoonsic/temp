package kr.co.koreazinc.app.integration;

import static org.junit.jupiter.api.Assertions.*;

import kr.co.koreazinc.app.scheduler.NoticeMailScheduler;
import kr.co.koreazinc.temp.model.entity.notice.*;
import kr.co.koreazinc.temp.repository.notice.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;

@SpringBootTest(properties = "spring.profiles.active=test")
@ActiveProfiles("test")
class NoticeSchedulerIntegrationTest {

    @Autowired private NoticeMailScheduler scheduler;
    @Autowired private NoticeBaseRepository noticeBaseRepository;
    @Autowired private NoticeTargetRepository noticeTargetRepository;
    @Autowired private NoticeSendPlanRepository noticeSendPlanRepository;
    @Autowired private NoticeDeliveryLogRepository noticeDeliveryLogRepository;
    @Autowired private NoticeRecipientRepository noticeRecipientRepository;
    @Autowired private UserMasterRepository userMasterRepository;

    @BeforeEach
    void clean() {
        noticeRecipientRepository.deleteAll();
        noticeDeliveryLogRepository.deleteAll();
        noticeSendPlanRepository.deleteAll();
        noticeTargetRepository.deleteAll();
        noticeBaseRepository.deleteAll();
        userMasterRepository.deleteAll();
    }

    @Test
    void scheduled_send_dispatches_due_plans() {
        UserMaster user = UserMaster.builder()
            .userId("user1")
            .userKoNm("User")
            .email("user1@test.local")
            .isActive(true)
            .build();
        userMasterRepository.save(user);

        NoticeBase notice = NoticeBase.builder()
            .title("t")
            .content("c")
            .noticeLevel(NoticeBase.NoticeLevel.L1)
            .noticeStatus("APPROVED")
            .createdBy("user1")
            .updatedBy("user1")
            .build();
        notice = noticeBaseRepository.save(notice);

        noticeTargetRepository.save(NoticeTarget.builder()
            .noticeId(notice.getNoticeId())
            .targetType("USER")
            .targetKey("user1")
            .targetName("User One")
            .build());

        noticeSendPlanRepository.save(NoticeSendPlan.builder()
            .noticeId(notice.getNoticeId())
            .sendMode(NoticeSendPlan.SendMode.SCHEDULED)
            .scheduledSendAt(LocalDateTime.now().minusMinutes(1))
            .build());

        scheduler.sendScheduledNotices();

        assertTrue(noticeSendPlanRepository.findByNoticeId(notice.getNoticeId()).isEmpty());
        NoticeBase refreshed = noticeBaseRepository.findById(notice.getNoticeId()).orElseThrow();
        assertEquals("SENT", refreshed.getNoticeStatus());
        assertFalse(noticeRecipientRepository.findByNoticeIdOrderByCreatedAtAsc(notice.getNoticeId()).isEmpty());
    }
}
