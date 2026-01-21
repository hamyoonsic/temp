package kr.co.koreazinc.temp.model.entity.notice;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 공지 발송 이력 엔티티
 * 위치: temp/data-temp/src/main/java/kr/co/koreazinc/temp/model/entity/notice/NoticeDeliveryLog.java
 */
@Entity
@Table(name = "notice_delivery_log")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NoticeDeliveryLog {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "delivery_id")
    private Long deliveryId;
    
    @Column(name = "notice_id", nullable = false)
    private Long noticeId;
    
    @Column(name = "channel", nullable = false, length = 30)
    @Builder.Default
    private String channel = "OUTLOOK_MAIL";
    
    @Column(name = "delivery_status", nullable = false, length = 20)
    private String deliveryStatus;  // READY, SENT, FAILED
    
    @Column(name = "sent_at")
    private LocalDateTime sentAt;
    
    @Column(name = "attempt_count", nullable = false)
    @Builder.Default
    private Integer attemptCount = 0;
    
    @Column(name = "last_error", columnDefinition = "TEXT")
    private String lastError;
    
    @Column(name = "provider_message_id", length = 120)
    private String providerMessageId;
    
    @Column(name = "idempotency_key", length = 80)
    private String idempotencyKey;
    
    /**
     * 발송 상태 상수
     */
    public static class DeliveryStatus {
        public static final String READY = "READY";
        public static final String SENT = "SENT";
        public static final String FAILED = "FAILED";
    }
    
    /**
     * 발송 채널 상수
     */
    public static class Channel {
        public static final String OUTLOOK_MAIL = "OUTLOOK_MAIL";
        public static final String SMS = "SMS";
        public static final String PUSH = "PUSH";
    }
}