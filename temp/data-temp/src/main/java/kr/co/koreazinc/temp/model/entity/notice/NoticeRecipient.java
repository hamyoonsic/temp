package kr.co.koreazinc.temp.model.entity.notice;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * 공지 수신자 엔티티
 * 위치: temp/data-temp/src/main/java/kr/co/koreazinc/temp/model/entity/notice/NoticeRecipient.java
 */
@Entity
@Table(name = "notice_recipient")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NoticeRecipient {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "recipient_id")
    private Long recipientId;
    
    @Column(name = "notice_id", nullable = false)
    private Long noticeId;
    
    @Column(name = "user_id", nullable = false, length = 50)
    private String userId;
    
    @Column(name = "sent_at")
    private LocalDateTime sentAt;
    
    @Column(name = "read_at")
    private LocalDateTime readAt;
    
    @Column(name = "is_read", nullable = false)
    @Builder.Default
    private Boolean isRead = false;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}