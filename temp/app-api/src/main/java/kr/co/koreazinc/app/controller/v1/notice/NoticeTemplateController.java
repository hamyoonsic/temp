package kr.co.koreazinc.app.controller.v1.notice;

import kr.co.koreazinc.app.dto.notice.ApiResponse;
import kr.co.koreazinc.app.dto.notice.NoticeTemplateDto;
import kr.co.koreazinc.app.service.notice.NoticeTemplateService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/v1/api/notices/templates")
@RequiredArgsConstructor
public class NoticeTemplateController {
    private final NoticeTemplateService templateService;

    @GetMapping
    public ApiResponse<List<NoticeTemplateDto>> getTemplates(
        @RequestParam(required = false) String userId,
        @RequestHeader(value = "X-User-Id", required = false) String headerUserId) {

        String resolvedUserId = resolveUserId(userId, headerUserId);
        return ApiResponse.success(templateService.getTemplates(resolvedUserId));
    }

    @PostMapping
    public ApiResponse<NoticeTemplateDto> createTemplate(
        @RequestBody NoticeTemplateDto dto,
        @RequestHeader(value = "X-User-Id", required = false) String headerUserId) {

        String resolvedUserId = resolveUserId(dto.getUserId(), headerUserId);
        return ApiResponse.success(templateService.createTemplate(resolvedUserId, dto));
    }

    @PutMapping("/{templateId}")
    public ApiResponse<NoticeTemplateDto> updateTemplate(
        @PathVariable Long templateId,
        @RequestBody NoticeTemplateDto dto,
        @RequestHeader(value = "X-User-Id", required = false) String headerUserId) {

        String resolvedUserId = resolveUserId(dto.getUserId(), headerUserId);
        return ApiResponse.success(templateService.updateTemplate(templateId, resolvedUserId, dto));
    }

    @DeleteMapping("/{templateId}")
    public ApiResponse<Void> deleteTemplate(
        @PathVariable Long templateId,
        @RequestParam(required = false) String userId,
        @RequestHeader(value = "X-User-Id", required = false) String headerUserId) {

        String resolvedUserId = resolveUserId(userId, headerUserId);
        templateService.deleteTemplate(templateId, resolvedUserId);
        return ApiResponse.success(null);
    }

    private String resolveUserId(String bodyUserId, String headerUserId) {
        if (headerUserId != null && !headerUserId.isBlank()) {
            return headerUserId;
        }
        if (bodyUserId != null && !bodyUserId.isBlank()) {
            return bodyUserId;
        }
        return "system";
    }
}
