package kr.co.koreazinc.app.controller.v1.admin;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import kr.co.koreazinc.app.dto.admin.AdminDelegationDto;
import kr.co.koreazinc.app.dto.notice.ApiResponse;
import kr.co.koreazinc.app.service.admin.AdminDelegationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

/**
 * 관리자 권한 위임 Controller
 * 위치: temp/app-api/src/main/java/kr/co/koreazinc/app/controller/v1/admin/AdminDelegationController.java
 */
@Slf4j
@RestController
@RequestMapping("/v1/api/admin/delegations")
@RequiredArgsConstructor
@Tag(name = "관리자 권한 위임", description = "관리자 권한 위임 관리 API")
public class AdminDelegationController {
    
    private final AdminDelegationService delegationService;
    
    /**
     * 관리자 권한 위임 생성
     * POST /v1/api/admin/delegations
     */
    @PostMapping
    @Operation(summary = "권한 위임 생성", description = "관리자 권한을 다른 사용자에게 위임합니다")
    public ApiResponse<AdminDelegationDto.Response> createDelegation(
            @RequestBody AdminDelegationDto.CreateRequest request,
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestHeader(value = "X-User-Name", required = false) String userNameEncoded,
            HttpServletRequest httpRequest) {
        
        // ✅ 헤더가 없으면 기본값 사용
        if (userId == null || userId.isEmpty()) {
            userId = "admin";
        }
        
        // ✅ X-User-Name Base64 디코딩
        String userName = decodeUserName(userNameEncoded);
        
        log.info("POST /v1/api/admin/delegations - User: {}, Name: {}, Delegate: {}", 
            userId, userName, request.getDelegateUserId());
        
        String ipAddress = getClientIp(httpRequest);
        
        AdminDelegationDto.Response response = delegationService.createDelegation(
            userId, userName, request, ipAddress
        );
        
        return ApiResponse.success(response);
    }
    
    /**
     * 위임 목록 조회 (위임자 기준)
     * GET /v1/api/admin/delegations/my
     */
    @GetMapping("/my")
    @Operation(summary = "내 위임 목록 조회", description = "내가 생성한 권한 위임 목록을 조회합니다")
    public ApiResponse<List<AdminDelegationDto.Response>> getMyDelegations(
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        
        // 헤더가 없으면 샘플 데이터 반환
        if (userId == null || userId.isEmpty()) {
            log.warn("GET /v1/api/admin/delegations/my - User-Id 헤더 없음, 샘플 데이터 반환");
            return ApiResponse.success(getSampleDelegations());
        }
        
        log.info("GET /v1/api/admin/delegations/my - User: {}", userId);
        
        List<AdminDelegationDto.Response> delegations = delegationService.getDelegationsByDelegator(userId);
        
        return ApiResponse.success(delegations);
    }
    
    /**
     * 현재 유효한 위임 조회 (대리자 기준)
     * GET /v1/api/admin/delegations/current
     */
    @GetMapping("/current")
    @Operation(summary = "현재 유효한 위임 조회", description = "내가 대리 관리자로 지정된 현재 유효한 위임을 조회합니다")
    public ApiResponse<AdminDelegationDto.Response> getCurrentDelegation(
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        
        // 헤더가 없으면 null 반환
        if (userId == null || userId.isEmpty()) {
            log.warn("GET /v1/api/admin/delegations/current - User-Id 헤더 없음");
            return ApiResponse.success(null);
        }
        
        log.info("GET /v1/api/admin/delegations/current - User: {}", userId);
        
        AdminDelegationDto.Response delegation = delegationService.getCurrentActiveDelegation(userId);
        
        return ApiResponse.success(delegation);
    }
    
    /**
     * 위임 비활성화
     * DELETE /v1/api/admin/delegations/{delegationId}
     */
    @DeleteMapping("/{delegationId}")
    @Operation(summary = "위임 비활성화", description = "권한 위임을 비활성화합니다")
    public ApiResponse<Void> deactivateDelegation(
            @PathVariable Long delegationId,
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestHeader(value = "X-User-Name", required = false) String userNameEncoded,
            HttpServletRequest httpRequest) {
        
        // ✅ 헤더가 없으면 기본값 사용
        if (userId == null || userId.isEmpty()) {
            userId = "admin";
        }
        
        // ✅ X-User-Name Base64 디코딩
        String userName = decodeUserName(userNameEncoded);
        
        log.info("DELETE /v1/api/admin/delegations/{} - User: {}, Name: {}", delegationId, userId, userName);
        
        String ipAddress = getClientIp(httpRequest);
        
        delegationService.deactivateDelegation(delegationId, userId, userName, ipAddress);
        
        return ApiResponse.success(null, "권한 위임이 비활성화되었습니다.");
    }
    
    /**
     * X-User-Name Base64 디코딩
     */
    private String decodeUserName(String encoded) {
        if (encoded == null || encoded.isEmpty()) {
            return "관리자";
        }
        
        try {
            byte[] decodedBytes = Base64.getDecoder().decode(encoded);
            return new String(decodedBytes, StandardCharsets.UTF_8);
        } catch (Exception e) {
            log.warn("X-User-Name 디코딩 실패: {}", encoded, e);
            return "관리자";
        }
    }
    
    /**
     * 샘플 데이터 생성 (개발/테스트용)
     */
    private List<AdminDelegationDto.Response> getSampleDelegations() {
        List<AdminDelegationDto.Response> samples = new ArrayList<>();
        
        // 샘플 위임 1 - 활성
        samples.add(AdminDelegationDto.Response.builder()
                .delegationId(1L)
                .delegatorUserId("tpdls7080")
                .delegatorUserNm("박세인")
                .delegateUserId("park001")
                .delegateUserNm("박경민")
                .startDate(LocalDateTime.now().minusDays(2))
                .endDate(LocalDateTime.now().plusDays(5))
                .reason("출장으로 인한 임시 권한 위임")
                .isActive(true)
                .isCurrentlyValid(true)
                .createdAt(LocalDateTime.now().minusDays(2))
                .createdBy("tpdls7080")
                .build());
        
        // 샘플 위임 2 - 예정
        samples.add(AdminDelegationDto.Response.builder()
                .delegationId(2L)
                .delegatorUserId("tpdls7080")
                .delegatorUserNm("박세인")
                .delegateUserId("shin001")
                .delegateUserNm("신호용")
                .startDate(LocalDateTime.now().plusDays(10))
                .endDate(LocalDateTime.now().plusDays(20))
                .reason("휴가 예정으로 인한 사전 위임")
                .isActive(true)
                .isCurrentlyValid(false)
                .createdAt(LocalDateTime.now().minusDays(1))
                .createdBy("tpdls7080")
                .build());
        
        return samples;
    }
    
    /**
     * 클라이언트 IP 주소 추출
     */
    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        
        return ip;
    }
}