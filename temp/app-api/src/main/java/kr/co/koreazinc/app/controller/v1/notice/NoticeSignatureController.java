package kr.co.koreazinc.app.controller.v1.notice;

import kr.co.koreazinc.app.dto.notice.ApiResponse;
import kr.co.koreazinc.app.dto.notice.NoticeSignatureDto;
import kr.co.koreazinc.app.service.notice.NoticeSignatureService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/v1/api/notices/signatures")
@RequiredArgsConstructor
public class NoticeSignatureController {
    private final NoticeSignatureService signatureService;

    @GetMapping
    public ApiResponse<List<NoticeSignatureDto>> getSignatures(
        @RequestParam(required = false) String userId,
        @RequestHeader(value = "X-User-Id", required = false) String headerUserId) {

        String resolvedUserId = resolveUserId(userId, headerUserId);
        return ApiResponse.success(signatureService.getSignatures(resolvedUserId));
    }

    @GetMapping("/default")
    public ApiResponse<NoticeSignatureDto> getDefaultSignature(
        @RequestParam(required = false) String userId,
        @RequestHeader(value = "X-User-Id", required = false) String headerUserId) {

        String resolvedUserId = resolveUserId(userId, headerUserId);
        return ApiResponse.success(signatureService.getDefaultSignature(resolvedUserId));
    }

    @PostMapping
    public ApiResponse<NoticeSignatureDto> createSignature(
        @RequestBody NoticeSignatureDto dto,
        @RequestHeader(value = "X-User-Id", required = false) String headerUserId) {

        String resolvedUserId = resolveUserId(dto.getUserId(), headerUserId);
        return ApiResponse.success(signatureService.createSignature(resolvedUserId, dto));
    }

    @PutMapping("/{signatureId}")
    public ApiResponse<NoticeSignatureDto> updateSignature(
        @PathVariable Long signatureId,
        @RequestBody NoticeSignatureDto dto,
        @RequestHeader(value = "X-User-Id", required = false) String headerUserId) {

        String resolvedUserId = resolveUserId(dto.getUserId(), headerUserId);
        return ApiResponse.success(signatureService.updateSignature(signatureId, resolvedUserId, dto));
    }

    @DeleteMapping("/{signatureId}")
    public ApiResponse<Void> deleteSignature(
        @PathVariable Long signatureId,
        @RequestParam(required = false) String userId,
        @RequestHeader(value = "X-User-Id", required = false) String headerUserId) {

        String resolvedUserId = resolveUserId(userId, headerUserId);
        signatureService.deleteSignature(signatureId, resolvedUserId);
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
