package kr.co.koreazinc.app.service.notice;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import kr.co.koreazinc.app.dto.notice.NoticeTemplateDto;
import kr.co.koreazinc.temp.model.entity.notice.NoticeTemplate;
import kr.co.koreazinc.temp.repository.notice.NoticeTemplateRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Optional;

class NoticeTemplateServiceTest {

    private NoticeTemplateService service;
    private NoticeTemplateRepository repository = mock(NoticeTemplateRepository.class);

    @BeforeEach
    void setUp() {
        service = new NoticeTemplateService(repository);
    }

    @Test
    void createTemplate_saves_entity() {
        NoticeTemplateDto dto = NoticeTemplateDto.builder()
            .name("temp1")
            .content("c")
            .build();

        when(repository.save(any(NoticeTemplate.class)))
            .thenAnswer(invocation -> invocation.getArgument(0));

        service.createTemplate("user1", dto);

        verify(repository).save(any(NoticeTemplate.class));
    }

    @Test
    void updateTemplate_owner_mismatch_throws() {
        NoticeTemplate existing = NoticeTemplate.builder()
            .templateId(10L)
            .userId("owner")
            .name("n")
            .content("c")
            .build();

        when(repository.findById(10L)).thenReturn(Optional.of(existing));

        NoticeTemplateDto dto = NoticeTemplateDto.builder()
            .name("new")
            .content("c2")
            .build();

        assertThrows(IllegalArgumentException.class,
            () -> service.updateTemplate(10L, "other", dto));
    }

    @Test
    void deleteTemplate_owner_mismatch_throws() {
        NoticeTemplate existing = NoticeTemplate.builder()
            .templateId(11L)
            .userId("owner")
            .name("n")
            .content("c")
            .build();

        when(repository.findById(11L)).thenReturn(Optional.of(existing));

        assertThrows(IllegalArgumentException.class,
            () -> service.deleteTemplate(11L, "other"));
    }
}
