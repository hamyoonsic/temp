package kr.co.koreazinc.app.service.notice;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import kr.co.koreazinc.spring.security.property.OAuth2Property;
import kr.co.koreazinc.temp.model.entity.notice.NoticeAttachment;
import kr.co.koreazinc.temp.repository.notice.NoticeAttachmentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Collections;
import java.util.Optional;

class NoticeAttachmentServiceTest {

    private NoticeAttachmentService service;

    private NoticeAttachmentRepository repository = mock(NoticeAttachmentRepository.class);
    private OAuth2Property oauth2Property = mock(OAuth2Property.class);

    @BeforeEach
    void setUp() {
        service = new NoticeAttachmentService(repository, oauth2Property);
    }

    @Test
    void getAttachmentsByNoticeId_returns_list() {
        when(repository.findByNoticeIdOrderByUploadedAtAsc(1L))
            .thenReturn(Collections.emptyList());

        assertNotNull(service.getAttachmentsByNoticeId(1L));
        verify(repository).findByNoticeIdOrderByUploadedAtAsc(1L);
    }

    @Test
    void deleteAttachment_deletes_existing() {
        NoticeAttachment attachment = NoticeAttachment.builder()
            .attachmentId(10L)
            .noticeId(1L)
            .fileName("f")
            .fileOriginalName("o")
            .filePath("/tmp/f")
            .fileSize(1L)
            .uploadedBy("user")
            .build();

        when(repository.findById(10L)).thenReturn(Optional.of(attachment));

        service.deleteAttachment(10L);

        verify(repository).delete(attachment);
    }

    @Test
    void downloadFile_throws_when_missing() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> service.downloadFile(99L));
    }
}
