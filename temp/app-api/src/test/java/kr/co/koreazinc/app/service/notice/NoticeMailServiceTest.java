package kr.co.koreazinc.app.service.notice;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import kr.co.koreazinc.app.configuration.MailTestProperty;
import kr.co.koreazinc.spring.security.property.OAuth2Property;
import kr.co.koreazinc.temp.model.entity.notice.NoticeBase;
import kr.co.koreazinc.temp.repository.notice.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Optional;

class NoticeMailServiceTest {

    private NoticeMailService service;

    private NoticeBaseRepository noticeBaseRepository = mock(NoticeBaseRepository.class);
    private NoticeTargetRepository noticeTargetRepository = mock(NoticeTargetRepository.class);
    private NoticeAttachmentRepository noticeAttachmentRepository = mock(NoticeAttachmentRepository.class);
    private NoticeSendPlanRepository sendPlanRepository = mock(NoticeSendPlanRepository.class);
    private NoticeDeliveryLogRepository deliveryLogRepository = mock(NoticeDeliveryLogRepository.class);
    private NoticeRecipientRepository recipientRepository = mock(NoticeRecipientRepository.class);
    private UserMasterRepository userMasterRepository = mock(UserMasterRepository.class);
    private CorporationMasterRepository corporationMasterRepository = mock(CorporationMasterRepository.class);
    private OrganizationMasterRepository organizationMasterRepository = mock(OrganizationMasterRepository.class);
    private OutlookCalendarService outlookCalendarService = mock(OutlookCalendarService.class);

    private OAuth2Property oauth2Property = mock(OAuth2Property.class);
    private MailTestProperty mailTestProperty = new MailTestProperty();

    @BeforeEach
    void setUp() {
        service = new NoticeMailService(
            noticeBaseRepository,
            noticeTargetRepository,
            noticeAttachmentRepository,
            sendPlanRepository,
            deliveryLogRepository,
            recipientRepository,
            userMasterRepository,
            corporationMasterRepository,
            organizationMasterRepository,
            outlookCalendarService,
            oauth2Property,
            mailTestProperty
        );
    }

    @Test
    void sendNoticeEmail_skips_when_not_approved() {
        NoticeBase notice = new NoticeBase();
        notice.setNoticeStatus("PENDING");
        when(noticeBaseRepository.findById(1L)).thenReturn(Optional.of(notice));

        service.sendNoticeEmail(1L);

        verify(deliveryLogRepository, never()).save(any());
    }
}
