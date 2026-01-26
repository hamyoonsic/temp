package kr.co.koreazinc.app.service.notice;

import kr.co.koreazinc.app.dto.notice.NoticeTemplateDto;
import kr.co.koreazinc.temp.model.entity.notice.NoticeTemplate;
import kr.co.koreazinc.temp.repository.notice.NoticeTemplateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NoticeTemplateService {
    private final NoticeTemplateRepository templateRepository;

    @Transactional(readOnly = true)
    public List<NoticeTemplateDto> getTemplates(String userId) {
        return templateRepository.findByUserIdOrderByUpdatedAtDesc(userId)
            .stream()
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    @Transactional
    public NoticeTemplateDto createTemplate(String userId, NoticeTemplateDto dto) {
        NoticeTemplate template = NoticeTemplate.builder()
            .userId(userId)
            .name(dto.getName())
            .content(dto.getContent())
            .build();
        return toDto(templateRepository.save(template));
    }

    @Transactional
    public NoticeTemplateDto updateTemplate(Long templateId, String userId, NoticeTemplateDto dto) {
        NoticeTemplate template = templateRepository.findById(templateId)
            .orElseThrow(() -> new IllegalArgumentException("template not found"));
        if (!template.getUserId().equals(userId)) {
            throw new IllegalArgumentException("template owner mismatch");
        }
        template.setName(dto.getName());
        template.setContent(dto.getContent());
        return toDto(templateRepository.save(template));
    }

    @Transactional
    public void deleteTemplate(Long templateId, String userId) {
        NoticeTemplate template = templateRepository.findById(templateId)
            .orElseThrow(() -> new IllegalArgumentException("template not found"));
        if (!template.getUserId().equals(userId)) {
            throw new IllegalArgumentException("template owner mismatch");
        }
        templateRepository.delete(template);
    }

    private NoticeTemplateDto toDto(NoticeTemplate template) {
        return NoticeTemplateDto.builder()
            .templateId(template.getTemplateId())
            .userId(template.getUserId())
            .name(template.getName())
            .content(template.getContent())
            .build();
    }
}
