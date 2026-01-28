package kr.co.koreazinc.app.controller.v1.notice;

import kr.co.koreazinc.app.dto.notice.ApiResponse;
import kr.co.koreazinc.app.dto.notice.NoticeRegistrationDto;
import kr.co.koreazinc.app.dto.notice.NoticeResponseDto;
import kr.co.koreazinc.app.service.notice.NoticeService;
import kr.co.koreazinc.app.service.notice.NoticeResendService;
import kr.co.koreazinc.temp.model.entity.notice.NoticeBase;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * 공지 관리 Controller
 * 위치: temp/app-api/src/main/java/kr/co/koreazinc/app/controller/v1/notice/NoticeController.java
 */
@Slf4j
@RestController
@RequestMapping("/v1/api/notices")
@RequiredArgsConstructor
public class NoticeController {
    
    private final NoticeService noticeService;
    private final NoticeResendService noticeResendService;
    
    /**
     * 공지 등록
     * POST /v1/api/notices
     */
    @PostMapping
    public ApiResponse<Map<String, Object>> createNotice(
            @RequestBody NoticeRegistrationDto dto) {
        
        log.info("POST /v1/api/notices - 공지 등록: {}", dto.getTitle());
        
        // TODO: 인증된 사용자 ID 가져오기 (Spring Security 적용 후)
        String userId = dto.getCreatedBy() != null ? dto.getCreatedBy() : "system";
        
        Long noticeId = noticeService.createNotice(dto, userId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("noticeId", noticeId);
        response.put("status", "PENDING");
        response.put("createdAt", LocalDateTime.now());
        
        return ApiResponse.success(response, "공지가 등록되었습니다.");
    }
    
    /**
     * 공지 목록 조회
     * GET /v1/api/notices
     */
    @GetMapping
    public ApiResponse<Map<String, Object>> getNotices(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) NoticeBase.NoticeLevel noticeLevel,
            @RequestParam(required = false) Long serviceId,
            @RequestParam(required = false) Long corpId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String receiverDept,
            @RequestParam(required = false) String createdBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        log.info("GET /v1/api/notices - 공지 목록 조회: status={}, level={}, corpId={}, startDate={}, endDate={}, search={}, receiverDept={}, createdBy={}",
            status, noticeLevel, corpId, startDate, endDate, search, receiverDept, createdBy);
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        
        Page<NoticeResponseDto> noticePage = noticeService.getNotices(
                status, noticeLevel, serviceId, corpId, startDate, endDate, search, receiverDept, createdBy, pageable
        );
        
        Map<String, Object> response = new HashMap<>();
        response.put("data", noticePage.getContent());
        response.put("currentPage", noticePage.getNumber());
        response.put("totalPages", noticePage.getTotalPages());
        response.put("totalElements", noticePage.getTotalElements());
        response.put("pageSize", noticePage.getSize());
        
        return ApiResponse.success(response);
    }
    
    /**
     * 공지 상세 조회
     * GET /v1/api/notices/{noticeId}
     */
    @GetMapping("/{noticeId}")
    public ApiResponse<NoticeResponseDto> getNoticeDetail(@PathVariable Long noticeId) {
        log.info("GET /v1/api/notices/{} - 공지 상세 조회", noticeId);
        
        NoticeResponseDto notice = noticeService.getNoticeDetail(noticeId);
        return ApiResponse.success(notice);
    }

    /**
     * 완료 공지 조회
     * GET /v1/api/notices/{noticeId}/completion
     */
    @GetMapping("/{noticeId}/completion")
    public ApiResponse<NoticeResponseDto> getCompletionNotice(@PathVariable Long noticeId) {
        log.info("GET /v1/api/notices/{}/completion - 완료 공지 조회", noticeId);
        NoticeResponseDto notice = noticeService.getCompletionNotice(noticeId);
        return ApiResponse.success(notice);
    }
    
    /**
     * 공지 승인
     * POST /v1/api/notices/{noticeId}/approve
     */
    @PostMapping("/{noticeId}/approve")
    public ApiResponse<Void> approveNotice(
            @PathVariable Long noticeId,
            @RequestHeader(value = "X-User-Id", required = false) String approver) {
        log.info("POST /v1/api/notices/{}/approve - ?? ??", noticeId);

        if (approver == null || approver.isBlank()) {
            approver = "admin";
        }

        noticeService.approveNotice(noticeId, approver);
        return ApiResponse.success(null, "승인 처리되었습니다.");
    }

    /**
     * 공지 재발송
     * POST /v1/api/notices/{noticeId}/retry
     */
    @PostMapping("/{noticeId}/retry")
    public ApiResponse<Void> retryNotice(
            @PathVariable Long noticeId,
            @RequestHeader(value = "X-User-Id", required = false) String requester) {
        if (requester == null || requester.isBlank()) {
            requester = "admin";
        }
        noticeResendService.resendNotice(noticeId, requester);
        return ApiResponse.success(null, "재발송 요청이 완료되었습니다.");
    }

    /**
     * 공지 재발송 가능 여부
     * GET /v1/api/notices/{noticeId}/can-resend
     */
    @GetMapping("/{noticeId}/can-resend")
    public ApiResponse<Boolean> canResend(@PathVariable Long noticeId) {
        return ApiResponse.success(noticeResendService.canResend(noticeId));
    }

    /**
     * 캘린더 이벤트 재생성
     * POST /v1/api/notices/{noticeId}/calendar/retry
     */
    @PostMapping("/{noticeId}/calendar/retry")
    public ApiResponse<Void> retryCalendar(
            @PathVariable Long noticeId,
            @RequestHeader(value = "X-User-Id", required = false) String requester) {
        if (requester == null || requester.isBlank()) {
            requester = "admin";
        }
        noticeService.regenerateCalendarEvent(noticeId, requester);
        return ApiResponse.success(null, "캘린더 재생성이 요청되었습니다.");
    }

    /**
     * 재발송 통계
     * GET /v1/api/notices/resend-statistics
     */
    @GetMapping("/resend-statistics")
    public ApiResponse<NoticeResendService.ResendStatistics> getResendStatistics(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        LocalDateTime from = (startDate != null) ? startDate.atStartOfDay() : LocalDate.now().minusMonths(1).atStartOfDay();
        LocalDateTime to = (endDate != null) ? endDate.atTime(23, 59, 59) : LocalDateTime.now();
        return ApiResponse.success(noticeResendService.getResendStatistics(from, to));
    }

/**
     * 공지 반려
     * POST /v1/api/notices/{noticeId}/reject
     */
    @PostMapping("/{noticeId}/reject")
    public ApiResponse<Void> rejectNotice(
            @PathVariable Long noticeId,
            @RequestParam String reason,
            @RequestHeader(value = "X-User-Id", required = false) String rejector) {

        log.info("POST /v1/api/notices/{}/reject - ?? ??", noticeId);

        if (rejector == null || rejector.isBlank()) {
            rejector = "admin";
        }

        noticeService.rejectNotice(noticeId, reason, rejector);
        return ApiResponse.success(null, "반려 처리되었습니다.");
    }

/**
     * 대시보드 통계 조회
     * GET /v1/api/notices/dashboard/stats
     */
    @GetMapping("/dashboard/stats")
    public ApiResponse<NoticeService.DashboardStats> getDashboardStats() {
        log.info("GET /v1/api/notices/dashboard/stats - 대시보드 통계 조회");
        
        NoticeService.DashboardStats stats = noticeService.getDashboardStats();
        return ApiResponse.success(stats);
    }
}
