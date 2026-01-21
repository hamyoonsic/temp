package kr.co.koreazinc.app.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 관리자 권한 위임 DTO
 * 위치: temp/app-api/src/main/java/kr/co/koreazinc/app/dto/admin/AdminDelegationDto.java
 */
public class AdminDelegationDto {
    
    /**
     * 위임 응답 DTO
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private Long delegationId;
        private String delegatorUserId;
        private String delegatorUserNm;
        private String delegateUserId;
        private String delegateUserNm;
        private LocalDateTime startDate;
        private LocalDateTime endDate;
        private String reason;
        private Boolean isActive;
        private Boolean isCurrentlyValid;
        private LocalDateTime createdAt;
        private String createdBy;
    }
    
    /**
     * 위임 생성 요청 DTO
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateRequest {
        private String delegateUserId;
        private String delegateUserNm;
        private LocalDateTime startDate;
        private LocalDateTime endDate;
        private String reason;
    }
    
    /**
     * 위임 수정 요청 DTO
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateRequest {
        private LocalDateTime startDate;
        private LocalDateTime endDate;
        private String reason;
        private Boolean isActive;
    }
}