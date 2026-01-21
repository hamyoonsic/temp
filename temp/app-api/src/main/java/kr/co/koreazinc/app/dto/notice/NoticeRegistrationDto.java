package kr.co.koreazinc.app.dto.notice;

import kr.co.koreazinc.temp.model.entity.notice.NoticeBase.NoticeLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 공지 등록 요청 DTO (발송 계획 포함)
 * 위치: temp/app-api/src/main/java/kr/co/koreazinc/app/dto/notice/NoticeRegistrationDto.java
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NoticeRegistrationDto {
    
    // 기본 정보
    private String title;
    private String content;
    private NoticeLevel noticeLevel;
    private Long affectedServiceId;
    
    // 발신 정보
    private String senderOrgUnitId;
    private String senderOrgUnitName;
    private String senderEmail;
    private String createdBy;
    
    // 발송 일정
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime publishStartAt;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime publishEndAt;
    
    // 시스템 점검 여부
    private Boolean isMaintenance;
    
    // 메일 제목
    private String mailSubject;
    
    // 수신 대상
    private List<TargetDto> targets;
    
    // 태그
    private List<String> tags;
    
    // ✅ 발송 계획 (새로 추가)
    private SendPlanDto sendPlan;
    
    // ✅ Outlook 캘린더 연동 (새로 추가)
    private OutlookCalendarDto outlookCalendar;
    
    /**
     * 대상 정보 DTO
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TargetDto {
        private String targetType;  // CORP, ORG_UNIT, USER
        private String targetKey;
        private String targetName;
    }
    
    /**
     * ✅ 발송 계획 DTO
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SendPlanDto {
        private String sendMode;  // IMMEDIATE, SCHEDULED
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
        private LocalDateTime scheduledSendAt;
        private Boolean allowBundle;
    }
    
    /**
     * ✅ Outlook 캘린더 연동 DTO
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OutlookCalendarDto {
        private Boolean register;
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
        private LocalDateTime eventDate;
    }
}
