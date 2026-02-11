package kr.co.koreazinc.app.service.notice;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import kr.co.koreazinc.temp.model.entity.notice.NoticeBase;
import kr.co.koreazinc.temp.repository.notice.NoticeBaseRepository;
import kr.co.koreazinc.temp.repository.notice.NoticeDeliveryLogRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Optional;

class NoticeResendServiceTest {

    private NoticeResendService service;

    private NoticeBaseRepository noticeBaseRepository = mock(NoticeBaseRepository.class);
    private NoticeDeliveryLogRepository deliveryLogRepository = mock(NoticeDeliveryLogRepository.class);
    private NoticeMailService mailService = mock(NoticeMailService.class);

    @BeforeEach
    void setUp() {
        service = new NoticeResendService(noticeBaseRepository, deliveryLogRepository, mailService);
    }

    @Test
    void canResend_only_approved_or_failed() {
        NoticeBase approved = new NoticeBase();
        approved.setNoticeStatus("APPROVED");
        when(noticeBaseRepository.findById(1L)).thenReturn(Optional.of(approved));

        assertTrue(service.canResend(1L));
    }
}
