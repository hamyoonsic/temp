package kr.co.koreazinc.app.controller.v1.notice;

import kr.co.koreazinc.app.dto.notice.ApiResponse;
import kr.co.koreazinc.app.service.notice.NoticeSignatureImageService;
import kr.co.koreazinc.temp.model.entity.notice.NoticeSignatureImage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/v1/api/notices/signatures/images")
@RequiredArgsConstructor
public class NoticeSignatureImageController {
    private final NoticeSignatureImageService imageService;

    @PostMapping
    public ApiResponse<Map<String, Object>> uploadImage(
        @RequestParam("file") MultipartFile file,
        @RequestParam(required = false) String userId,
        @RequestHeader(value = "X-User-Id", required = false) String headerUserId) {

        String resolvedUserId = resolveUserId(userId, headerUserId);
        NoticeSignatureImage image = imageService.uploadImage(resolvedUserId, file);

        Map<String, Object> response = new HashMap<>();
        response.put("imageId", image.getImageId());
        response.put("fileName", image.getFileOriginalName());
        response.put("url", "/v1/api/notices/signatures/images/" + image.getImageId() + "/download");
        return ApiResponse.success(response);
    }

    @GetMapping("/{imageId}/download")
    public ResponseEntity<InputStreamResource> downloadImage(@PathVariable Long imageId) {
        InputStream stream = imageService.downloadImage(imageId);
        return ResponseEntity.ok()
            .contentType(MediaType.APPLICATION_OCTET_STREAM)
            .body(new InputStreamResource(stream));
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
