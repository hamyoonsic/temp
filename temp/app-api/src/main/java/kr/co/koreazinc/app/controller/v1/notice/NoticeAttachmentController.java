package kr.co.koreazinc.app.controller.v1.notice;

import kr.co.koreazinc.app.dto.notice.ApiResponse;
import kr.co.koreazinc.app.service.notice.NoticeAttachmentService;
import kr.co.koreazinc.temp.model.entity.notice.NoticeAttachment;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 공지 첨부파일 Controller
 * 위치: temp/app-api/src/main/java/kr/co/koreazinc/app/controller/v1/notice/NoticeAttachmentController.java
 */
@Slf4j
@RestController
@RequestMapping("/v1/api/notices")
@RequiredArgsConstructor
public class NoticeAttachmentController {
    
    private final NoticeAttachmentService attachmentService;
    
    /**
     * 파일 업로드
     * POST /v1/api/notices/{noticeId}/attachments
     */
    @PostMapping("/{noticeId}/attachments")
    public ApiResponse<NoticeAttachment> uploadFile(
            @PathVariable Long noticeId,
            @RequestParam("file") MultipartFile file,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        
        log.info("POST /v1/api/notices/{}/attachments - 파일 업로드: {}", noticeId, file.getOriginalFilename());
        
        String uploadedBy = userId != null ? userId : "system";
        NoticeAttachment attachment = attachmentService.uploadFile(noticeId, file, uploadedBy);
        
        return ApiResponse.success(attachment, "파일이 업로드되었습니다.");
    }
    
    /**
     * 여러 파일 일괄 업로드
     * POST /v1/api/notices/{noticeId}/attachments/bulk
     */
    @PostMapping("/{noticeId}/attachments/bulk")
    public ApiResponse<Map<String, Object>> uploadFiles(
            @PathVariable Long noticeId,
            @RequestParam("files") List<MultipartFile> files,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        
        log.info("POST /v1/api/notices/{}/attachments/bulk - 파일 일괄 업로드: {} files", noticeId, files.size());
        
        String uploadedBy = userId != null ? userId : "system";
        List<NoticeAttachment> attachments = attachmentService.uploadFiles(noticeId, files, uploadedBy);
        
        Map<String, Object> response = new HashMap<>();
        response.put("attachments", attachments);
        response.put("count", attachments.size());
        
        return ApiResponse.success(response, files.size() + "개 파일이 업로드되었습니다.");
    }
    
    /**
     * 공지의 모든 첨부파일 조회
     * GET /v1/api/notices/{noticeId}/attachments
     */
    @GetMapping("/{noticeId}/attachments")
    public ApiResponse<List<NoticeAttachment>> getAttachments(@PathVariable Long noticeId) {
        log.info("GET /v1/api/notices/{}/attachments - 첨부파일 목록 조회", noticeId);
        
        List<NoticeAttachment> attachments = attachmentService.getAttachmentsByNoticeId(noticeId);
        return ApiResponse.success(attachments);
    }
    
    /**
     * 파일 다운로드
     * GET /v1/api/notices/attachments/{attachmentId}/download
     */
    @GetMapping("/attachments/{attachmentId}/download")
    public ResponseEntity<InputStreamResource> downloadFile(@PathVariable Long attachmentId) {
        log.info("GET /v1/api/notices/attachments/{}/download - 파일 다운로드", attachmentId);
        
        try {
            // 첨부파일 정보 조회
            List<NoticeAttachment> attachments = attachmentService.getAttachmentsByNoticeId(attachmentId);
            NoticeAttachment attachment = attachments.stream()
                .filter(att -> att.getAttachmentId().equals(attachmentId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("첨부파일을 찾을 수 없습니다: " + attachmentId));
            
            // 파일 다운로드
            InputStream inputStream = attachmentService.downloadFile(attachmentId);
            
            // 파일명 인코딩 (한글 지원)
            String encodedFileName = URLEncoder.encode(attachment.getFileOriginalName(), StandardCharsets.UTF_8)
                .replace("+", "%20");
            
            return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename*=UTF-8''" + encodedFileName)
                .contentType(MediaType.parseMediaType(attachment.getFileType() != null ? 
                    attachment.getFileType() : MediaType.APPLICATION_OCTET_STREAM_VALUE))
                .contentLength(attachment.getFileSize())
                .body(new InputStreamResource(inputStream));
            
        } catch (Exception e) {
            log.error("파일 다운로드 실패: attachmentId={}, error={}", attachmentId, e.getMessage(), e);
            throw new RuntimeException("파일 다운로드 실패: " + e.getMessage(), e);
        }
    }
    
    /**
     * 첨부파일 삭제
     * DELETE /v1/api/notices/attachments/{attachmentId}
     */
    @DeleteMapping("/attachments/{attachmentId}")
    public ApiResponse<Void> deleteAttachment(@PathVariable Long attachmentId) {
        log.info("DELETE /v1/api/notices/attachments/{} - 첨부파일 삭제", attachmentId);
        
        attachmentService.deleteAttachment(attachmentId);
        return ApiResponse.success(null, "첨부파일이 삭제되었습니다.");
    }
}