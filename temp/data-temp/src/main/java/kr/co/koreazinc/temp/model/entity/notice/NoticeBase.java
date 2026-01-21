package kr.co.koreazinc.temp.model.entity.notice;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * 공지 기본 정보 엔티티
 * 위치: temp/data-temp/src/main/java/kr/co/koreazinc/temp/model/entity/notice/NoticeBase.java
 */
@Entity
@Table(name = "notice_base")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NoticeBase {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notice_id")
    private Long noticeId;
    
    @Column(name = "title", nullable = false, length = 200)
    private String title;
    
    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "notice_level", nullable = false)
    private NoticeLevel noticeLevel;
    
    @Column(name = "notice_status", nullable = false, length = 30)
    private String noticeStatus;
    
    @Column(name = "affected_service_id")
    private Long affectedServiceId;
    
    @Column(name = "sender_org_unit_id", length = 50)
    private String senderOrgUnitId;
    
    @Column(name = "sender_org_unit_name", length = 100)
    private String senderOrgUnitName;

    @Column(name = "sender_email", length = 150)
    private String senderEmail;
    
    @Column(name = "publish_start_at")
    private LocalDateTime publishStartAt;
    
    @Column(name = "publish_end_at")
    private LocalDateTime publishEndAt;
    
    @Column(name = "is_maintenance", nullable = false)
    @Builder.Default
    private Boolean isMaintenance = false;
    
    @Column(name = "is_completed", nullable = false)
    @Builder.Default
    private Boolean isCompleted = false;
    
    @Column(name = "completed_at")
    private LocalDateTime completedAt;
    
    @Column(name = "mail_subject", length = 300)
    private String mailSubject;

    @Column(name = "reject_reason", length = 500)
    private String rejectReason;

    @Column(name = "calendar_register", nullable = false)
    @Builder.Default
    private Boolean calendarRegister = false;

    @Column(name = "calendar_event_at")
    private LocalDateTime calendarEventAt;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "created_by", nullable = false, length = 50)
    private String createdBy;
    
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    @Column(name = "updated_by", nullable = false, length = 50)
    private String updatedBy;
    
    @Column(name = "parent_notice_id")
    private Long parentNoticeId;
    
    /**
     * 공지 중요도 레벨
     */
    public enum NoticeLevel {
        L1,  // 낮음 (파란색)
        L2,  // 중간 (주황색)
        L3   // 높음 (빨간색)
    }
}
