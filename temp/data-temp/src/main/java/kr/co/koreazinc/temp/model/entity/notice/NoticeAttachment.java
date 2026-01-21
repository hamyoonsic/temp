package kr.co.koreazinc.temp.model.entity.notice;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 공지 첨부파일 엔티티
 * 위치: temp/data-temp/src/main/java/kr/co/koreazinc/temp/model/entity/notice/NoticeAttachment.java
 */
@Entity
@Table(name = "notice_attachment")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NoticeAttachment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "attachment_id")
    private Long attachmentId;
    
    @Column(name = "notice_id", nullable = false)
    private Long noticeId;
    
    @Column(name = "file_name", nullable = false, length = 255)
    private String fileName;
    
    @Column(name = "file_original_name", nullable = false, length = 255)
    private String fileOriginalName;
    
    @Column(name = "file_path", nullable = false, columnDefinition = "TEXT")
    private String filePath;
    
    @Column(name = "file_size", nullable = false)
    private Long fileSize;
    
    @Column(name = "file_type", length = 100)
    private String fileType;
    
    @Column(name = "uploaded_by", nullable = false, length = 50)
    private String uploadedBy;
    
    @Column(name = "uploaded_at", nullable = false)
    @Builder.Default
    private LocalDateTime uploadedAt = LocalDateTime.now();
}