package kr.co.koreazinc.temp.model.entity.notice;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Outlook 캘린더 이벤트 엔티티
 * 위치: temp/data-temp/src/main/java/kr/co/koreazinc/temp/model/entity/notice/NoticeCalendarEvent.java
 */
@Entity
@Table(name = "notice_calendar_event")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NoticeCalendarEvent {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "calendar_event_id")
    private Long calendarEventId;
    
    @Column(name = "notice_id", nullable = false)
    private Long noticeId;
    
    @Column(name = "event_subject", length = 255)
    private String eventSubject;
    
    @Column(name = "event_body", columnDefinition = "TEXT")
    private String eventBody;
    
    @Column(name = "event_start_at", nullable = false)
    private LocalDateTime eventStartAt;
    
    @Column(name = "event_end_at")
    private LocalDateTime eventEndAt;
    
    @Column(name = "attendees", columnDefinition = "TEXT")
    private String attendees;  // JSON 형태로 저장
    
    @Column(name = "resource_mailbox", length = 150)
    private String resourceMailbox;  // 공지 자원 메일 주소
    
    @Column(name = "provider_event_id", length = 255)
    private String providerEventId;  // Graph API에서 반환한 이벤트 ID
    
    @Column(name = "created_at", nullable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}