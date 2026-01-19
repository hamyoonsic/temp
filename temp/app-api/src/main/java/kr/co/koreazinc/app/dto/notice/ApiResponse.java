package kr.co.koreazinc.app.dto.notice;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * API 공통 응답 DTO
 * 위치: temp/app-api/src/main/java/kr/co/koreazinc/app/dto/notice/ApiResponse.java
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {
    
    private boolean success;
    private T data;
    private String message;
    private String errorCode;
    
    /**
     * 성공 응답 생성 (데이터 + 메시지)
     */
    public static <T> ApiResponse<T> success(T data, String message) {
        return ApiResponse.<T>builder()
                .success(true)
                .data(data)
                .message(message)
                .build();
    }
    
    /**
     * 성공 응답 생성 (데이터만)
     */
    public static <T> ApiResponse<T> success(T data) {
        return success(data, "요청이 성공적으로 처리되었습니다.");
    }
    
    /**
     * 실패 응답 생성
     */
    public static <T> ApiResponse<T> error(String message, String errorCode) {
        return ApiResponse.<T>builder()
                .success(false)
                .message(message)
                .errorCode(errorCode)
                .build();
    }
    
    /**
     * 실패 응답 생성 (메시지만)
     */
    public static <T> ApiResponse<T> error(String message) {
        return error(message, "INTERNAL_ERROR");
    }
}
