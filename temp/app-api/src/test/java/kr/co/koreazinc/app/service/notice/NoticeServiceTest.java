package kr.co.koreazinc.app.service.notice;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import kr.co.koreazinc.app.dto.notice.NoticeRegistrationDto;
import kr.co.koreazinc.temp.model.entity.notice.NoticeBase;
import kr.co.koreazinc.temp.repository.notice.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class NoticeServiceTest {

    private NoticeService noticeService;

    private NoticeBaseRepository noticeBaseRepository = mock(NoticeBaseRepository.class);
    private NoticeTargetRepository noticeTargetRepository = mock(NoticeTargetRepository.class);
    private ServiceMasterRepository serviceMasterRepository = mock(ServiceMasterRepository.class);
    private OrganizationMasterRepository organizationMasterRepository = mock(OrganizationMasterRepository.class);
    private CorporationMasterRepository corporationMasterRepository = mock(CorporationMasterRepository.class);
    private NoticeSendPlanRepository noticeSendPlanRepository = mock(NoticeSendPlanRepository.class);
    private NoticeMailService noticeMailService = mock(NoticeMailService.class);
    private OutlookCalendarService outlookCalendarService = mock(OutlookCalendarService.class);
    private UserMasterRepository userMasterRepository = mock(UserMasterRepository.class);

    @BeforeEach
    void setUp() {
        noticeService = new NoticeService(
            noticeBaseRepository,
            noticeTargetRepository,
            serviceMasterRepository,
            organizationMasterRepository,
            corporationMasterRepository,
            noticeSendPlanRepository,
            noticeMailService,
            outlookCalendarService,
            userMasterRepository
        );
    }

    @Test
    void createNotice_sets_pending_status() {
        NoticeRegistrationDto dto = NoticeRegistrationDto.builder()
            .title("t1")
            .content("c1")
            .build();

        when(noticeBaseRepository.save(any(NoticeBase.class)))
            .thenAnswer(invocation -> {
                NoticeBase n = invocation.getArgument(0);
                n.setNoticeId(1L);
                return n;
            });

        Long id = noticeService.createNotice(dto, "user1");
        assertNotNull(id);
    }

    @Test
    void updateNotice_only_when_pending_and_creator() {
        NoticeBase notice = new NoticeBase();
        notice.setNoticeId(1L);
        notice.setNoticeStatus("PENDING");
        notice.setCreatedBy("user1");

        when(noticeBaseRepository.findById(1L)).thenReturn(java.util.Optional.of(notice));
        when(noticeBaseRepository.save(any(NoticeBase.class))).thenAnswer(invocation -> invocation.getArgument(0));

        NoticeRegistrationDto dto = NoticeRegistrationDto.builder()
            .title("updated")
            .content("content")
            .build();

        assertDoesNotThrow(() -> noticeService.updateNotice(1L, dto, "user1"));

        assertThrows(RuntimeException.class,
            () -> noticeService.updateNotice(1L, dto, "other"));
    }

    @Test
    void approveNotice_pending_only() {
        NoticeBase notice = new NoticeBase();
        notice.setNoticeId(1L);
        notice.setNoticeStatus("PENDING");

        when(noticeBaseRepository.findById(1L)).thenReturn(java.util.Optional.of(notice));
        when(noticeBaseRepository.save(any(NoticeBase.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(noticeSendPlanRepository.findByNoticeId(1L)).thenReturn(java.util.Optional.empty());

        noticeService.approveNotice(1L, "approver");

        assertEquals("APPROVED", notice.getNoticeStatus());
    }
}
