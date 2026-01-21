package kr.co.koreazinc.app.service.notice;

import kr.co.koreazinc.spring.model.FileInfo;
import kr.co.koreazinc.spring.security.property.OAuth2Property;
import kr.co.koreazinc.spring.utility.FileUtils;
import kr.co.koreazinc.temp.model.entity.notice.NoticeAttachment;
import kr.co.koreazinc.temp.repository.notice.NoticeAttachmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.UUID;

/**
 * 공지 첨부파일 관리 서비스
 * 위치: temp/app-api/src/main/java/kr/co/koreazinc/app/service/notice/NoticeAttachmentService.java
 * 
 * spring-core FileUtils 활용:
 * - FileUtils.remoteUpload() - 파일 업로드
 * - FileUtils.remoteDownload() - 파일 다운로드
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class NoticeAttachmentService {
    
    private final NoticeAttachmentRepository attachmentRepository;
    private final OAuth2Property oauth2Property;
    
    private static final String SYSTEM_NAME = "notice";
    private static final String CORPORATION_NAME = "koreazinc";
    private static final String UPLOAD_PATH = "notices/attachments";
    
    /**
     * 파일 업로드 (spring-core FileUtils 활용)
     */
    @Transactional
    public NoticeAttachment uploadFile(Long noticeId, MultipartFile file, String uploadedBy) {
        log.info("📎 파일 업로드 시작: noticeId={}, fileName={}", noticeId, file.getOriginalFilename());
        
        try {
            // 1. 파일명 생성 (UUID + 원본 확장자)
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String savedFileName = UUID.randomUUID().toString() + extension;
            
            // 2. FileInfo 구성
            FileInfo fileInfo = FileInfo.builder()
                .file(file.getInputStream())
                .system(SYSTEM_NAME)
                .corporation(CORPORATION_NAME)
                .path(UPLOAD_PATH)
                .name(savedFileName)
                .size(file.getSize())
                .build();
            
            // 3. spring-core FileUtils로 업로드
            FileInfo uploadedFile = FileUtils.remoteUpload(oauth2Property.getCredential("file"), fileInfo);
            
            // 4. DB에 첨부파일 정보 저장
            NoticeAttachment attachment = NoticeAttachment.builder()
                .noticeId(noticeId)
                .fileName(savedFileName)
                .fileOriginalName(originalFilename)
                .filePath(uploadedFile.getPath() + uploadedFile.getName())
                .fileSize(file.getSize())
                .fileType(file.getContentType())
                .uploadedBy(uploadedBy)
                .build();
            
            NoticeAttachment saved = attachmentRepository.save(attachment);
            
            log.info("✅ 파일 업로드 완료: attachmentId={}, path={}", 
                saved.getAttachmentId(), saved.getFilePath());
            
            return saved;
            
        } catch (IOException e) {
            log.error("❌ 파일 업로드 실패: noticeId={}, error={}", noticeId, e.getMessage(), e);
            throw new RuntimeException("파일 업로드 실패: " + e.getMessage(), e);
        }
    }
    
    /**
     * 여러 파일 일괄 업로드
     */
    @Transactional
    public List<NoticeAttachment> uploadFiles(Long noticeId, List<MultipartFile> files, String uploadedBy) {
        log.info("📎 파일 일괄 업로드: noticeId={}, count={}", noticeId, files.size());
        
        return files.stream()
            .map(file -> uploadFile(noticeId, file, uploadedBy))
            .toList();
    }
    
    /**
     * 파일 다운로드 (spring-core FileUtils 활용)
     */
    public InputStream downloadFile(Long attachmentId) {
        log.info("📥 파일 다운로드 시작: attachmentId={}", attachmentId);
        
        try {
            // 1. 첨부파일 정보 조회
            NoticeAttachment attachment = attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new RuntimeException("첨부파일을 찾을 수 없습니다: " + attachmentId));
            
            // 2. FileInfo 구성
            FileInfo fileInfo = FileInfo.builder()
                .system(SYSTEM_NAME)
                .corporation(CORPORATION_NAME)
                .path(UPLOAD_PATH)
                .name(attachment.getFileName())
                .build();
            
            // 3. spring-core FileUtils로 다운로드
            InputStream inputStream = FileUtils.remoteDownload(oauth2Property.getCredential("file"), fileInfo);
            
            log.info("✅ 파일 다운로드 완료: attachmentId={}", attachmentId);
            return inputStream;
            
        } catch (IOException e) {
            log.error("❌ 파일 다운로드 실패: attachmentId={}, error={}", attachmentId, e.getMessage(), e);
            throw new RuntimeException("파일 다운로드 실패: " + e.getMessage(), e);
        }
    }
    
    /**
     * 공지의 모든 첨부파일 조회
     */
    @Transactional(readOnly = true)
    public List<NoticeAttachment> getAttachmentsByNoticeId(Long noticeId) {
        return attachmentRepository.findByNoticeIdOrderByUploadedAtAsc(noticeId);
    }
    
    /**
     * 첨부파일 삭제
     */
    @Transactional
    public void deleteAttachment(Long attachmentId) {
        log.info("🗑️ 첨부파일 삭제: attachmentId={}", attachmentId);
        
        NoticeAttachment attachment = attachmentRepository.findById(attachmentId)
            .orElseThrow(() -> new RuntimeException("첨부파일을 찾을 수 없습니다: " + attachmentId));
        
        // TODO: 실제 파일 삭제는 spring-core File API에 delete 기능이 추가되면 구현
        // 현재는 DB 레코드만 삭제
        
        attachmentRepository.delete(attachment);
        log.info("✅ 첨부파일 삭제 완료: attachmentId={}", attachmentId);
    }
    
    /**
     * 공지의 모든 첨부파일 삭제
     */
    @Transactional
    public void deleteAttachmentsByNoticeId(Long noticeId) {
        log.info("🗑️ 공지 첨부파일 전체 삭제: noticeId={}", noticeId);
        attachmentRepository.deleteByNoticeId(noticeId);
    }
}