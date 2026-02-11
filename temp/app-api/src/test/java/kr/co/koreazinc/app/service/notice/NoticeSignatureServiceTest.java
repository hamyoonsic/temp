package kr.co.koreazinc.app.service.notice;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import kr.co.koreazinc.app.dto.notice.NoticeSignatureDto;
import kr.co.koreazinc.temp.model.entity.notice.NoticeSignature;
import kr.co.koreazinc.temp.repository.notice.NoticeSignatureRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Optional;

class NoticeSignatureServiceTest {

    private NoticeSignatureService service;
    private NoticeSignatureRepository repository = mock(NoticeSignatureRepository.class);

    @BeforeEach
    void setUp() {
        service = new NoticeSignatureService(repository);
    }

    @Test
    void createSignature_clears_default_when_flag_true() {
        NoticeSignatureDto dto = NoticeSignatureDto.builder()
            .name("sig1")
            .content("content")
            .isDefault(true)
            .build();

        when(repository.save(any(NoticeSignature.class)))
            .thenAnswer(invocation -> invocation.getArgument(0));

        service.createSignature("user1", dto);

        verify(repository).clearDefaultByUserId("user1");
        verify(repository).save(any(NoticeSignature.class));
    }

    @Test
    void updateSignature_owner_mismatch_throws() {
        NoticeSignature existing = NoticeSignature.builder()
            .signatureId(10L)
            .userId("owner")
            .name("n")
            .content("c")
            .build();

        when(repository.findById(10L)).thenReturn(Optional.of(existing));

        NoticeSignatureDto dto = NoticeSignatureDto.builder()
            .name("new")
            .content("c2")
            .build();

        assertThrows(IllegalArgumentException.class,
            () -> service.updateSignature(10L, "other", dto));
    }

    @Test
    void deleteSignature_owner_mismatch_throws() {
        NoticeSignature existing = NoticeSignature.builder()
            .signatureId(11L)
            .userId("owner")
            .name("n")
            .content("c")
            .build();

        when(repository.findById(11L)).thenReturn(Optional.of(existing));

        assertThrows(IllegalArgumentException.class,
            () -> service.deleteSignature(11L, "other"));
    }
}
