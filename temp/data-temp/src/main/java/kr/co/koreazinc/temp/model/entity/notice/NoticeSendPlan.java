package kr.co.koreazinc.temp.model.entity.notice;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 공지 발송 계획 엔티티
 * 위치: temp/data-temp/src/main/java/kr/co/koreazinc/temp/model/entity/notice/NoticeSendPlan.java
 */
@Entity
@Table(name = "notice_send_plan")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NoticeSendPlan {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "send_plan_id")
    private Long sendPlanId;
    
    @Column(name = "notice_id", nullable = false)
    private Long noticeId;
    
    @Column(name = "send_mode", nullable = false, length = 20)
    private String sendMode;  // IMMEDIATE, SCHEDULED
    
    @Column(name = "scheduled_send_at")
    private LocalDateTime scheduledSendAt;
    
    @Column(name = "bundle_key", length = 80)
    private String bundleKey;  // 묶음 발송 키 (예: "2026-01-21-09:00")
    
    @Column(name = "allow_bundle", nullable = false)
    @Builder.Default
    private Boolean allowBundle = true;
    
    /**
     * 발송 방식 상수
     */
    public static class SendMode {
        public static final String IMMEDIATE = "IMMEDIATE";
        public static final String SCHEDULED = "SCHEDULED";
    }
    
    /**
     * 정기 발송 시간대 상수 (KST 기준)
     */
    public static class RegularSendTime {
        public static final int MORNING = 9;   // 09:00
        public static final int AFTERNOON_1 = 13;  // 13:00
        public static final int AFTERNOON_2 = 17;  // 17:00
    }
}