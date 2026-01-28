package kr.co.koreazinc.app.dto.notice;

import kr.co.koreazinc.temp.model.entity.notice.NoticeBase.NoticeLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 공지 응답 DTO
 * 위치: temp/app-api/src/main/java/kr/co/koreazinc/app/dto/notice/NoticeResponseDto.java
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NoticeResponseDto {
    
    // 기본 정보
    private Long noticeId;
    private String title;
    private String content;
    private String noticeType;
    private NoticeLevel noticeLevel;
    private String noticeStatus;
    private Boolean calendarRegister;
    private LocalDateTime calendarEventAt;
    
    // 서비스 정보
    private Long affectedServiceId;
    private ServiceDto affectedService;
    
    // 발신 정보
    private String senderOrgUnitId;
    private String senderOrgUnitName;
    
    // 발송 일정
    private LocalDateTime publishStartAt;
    private LocalDateTime publishEndAt;
    
    // 시스템 점검 관련
    private Boolean isMaintenance;
    private Boolean isCompleted;
    private LocalDateTime completedAt;
    
    // 메일 정보
    private String mailSubject;
    private String rejectReason;
    
    // 생성/수정 정보
    private LocalDateTime createdAt;
    private String createdBy;
    private String createdByName;
    private LocalDateTime updatedAt;
    private String updatedBy;
    private String updatedByName;
    
    // 수신 대상 (상세 조회 시)
    private List<TargetDto> targets;
    
    // 태그 (상세 조회 시)
    private List<String> tags;
    
    // 완료 공지 참조
    private Long parentNoticeId;
    
    /**
     * 서비스 정보 DTO
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ServiceDto {
        private Long serviceId;
        private String serviceCode;
        private String serviceName;
        private String serviceCategory;
    }
    
    /**
     * 대상 정보 DTO
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TargetDto {
        private Long targetId;
        private String targetType;
        private String targetKey;
        private String targetName;
    }
}
