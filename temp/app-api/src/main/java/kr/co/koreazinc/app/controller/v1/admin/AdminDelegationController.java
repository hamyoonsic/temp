package kr.co.koreazinc.app.controller.v1.admin;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import kr.co.koreazinc.app.dto.admin.AdminDelegationDto;
import kr.co.koreazinc.app.dto.notice.ApiResponse;
import kr.co.koreazinc.app.service.admin.AdminDelegationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;

/**
 * Admin delegation controller.
 */
@Slf4j
@RestController
@RequestMapping("/v1/api/admin/delegations")
@RequiredArgsConstructor
@Tag(name = "Admin Delegation", description = "Admin delegation APIs")
public class AdminDelegationController {

    private final AdminDelegationService delegationService;

    /**
     * Create delegation.
     * POST /v1/api/admin/delegations
     */
    @PostMapping
    @Operation(summary = "Create delegation", description = "Creates admin delegation")
    public ApiResponse<AdminDelegationDto.Response> createDelegation(
            @RequestBody AdminDelegationDto.CreateRequest request,
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestHeader(value = "X-User-Name", required = false) String userNameEncoded,
            HttpServletRequest httpRequest) {

        if (userId == null || userId.isEmpty()) {
            userId = "admin";
        }

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
     * Delegation list by delegator.
     * GET /v1/api/admin/delegations/my
     */
    @GetMapping("/my")
    @Operation(summary = "My delegations", description = "Returns delegations by delegator")
    public ApiResponse<List<AdminDelegationDto.Response>> getMyDelegations(
            @RequestHeader(value = "X-User-Id", required = false) String userId) {

        if (userId == null || userId.isEmpty()) {
            log.warn("GET /v1/api/admin/delegations/my - User-Id header missing");
            return ApiResponse.success(List.of());
        }

        log.info("GET /v1/api/admin/delegations/my - User: {}", userId);
        List<AdminDelegationDto.Response> delegations = delegationService.getDelegationsByDelegator(userId);
        return ApiResponse.success(delegations);
    }

    /**
     * Delegation list by delegate.
     * GET /v1/api/admin/delegations/received
     */
    @GetMapping("/received")
    @Operation(summary = "Received delegations", description = "Returns delegations by delegate")
    public ApiResponse<List<AdminDelegationDto.Response>> getReceivedDelegations(
            @RequestHeader(value = "X-User-Id", required = false) String userId) {

        if (userId == null || userId.isEmpty()) {
            log.warn("GET /v1/api/admin/delegations/received - User-Id header missing");
            return ApiResponse.success(List.of());
        }

        log.info("GET /v1/api/admin/delegations/received - User: {}", userId);
        List<AdminDelegationDto.Response> delegations = delegationService.getDelegationsByDelegate(userId);
        return ApiResponse.success(delegations);
    }

    /**
     * Current delegation by delegate.
     * GET /v1/api/admin/delegations/current
     */
    @GetMapping("/current")
    @Operation(summary = "Current delegation", description = "Returns active delegation for delegate")
    public ApiResponse<AdminDelegationDto.Response> getCurrentDelegation(
            @RequestHeader(value = "X-User-Id", required = false) String userId) {

        if (userId == null || userId.isEmpty()) {
            log.warn("GET /v1/api/admin/delegations/current - User-Id header missing");
            return ApiResponse.success(null);
        }

        log.info("GET /v1/api/admin/delegations/current - User: {}", userId);
        AdminDelegationDto.Response delegation = delegationService.getCurrentActiveDelegation(userId);
        return ApiResponse.success(delegation);
    }

    /**
     * Deactivate delegation.
     * DELETE /v1/api/admin/delegations/{delegationId}
     */
    @DeleteMapping("/{delegationId}")
    @Operation(summary = "Deactivate delegation", description = "Deactivates admin delegation")
    public ApiResponse<Void> deactivateDelegation(
            @PathVariable Long delegationId,
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestHeader(value = "X-User-Name", required = false) String userNameEncoded,
            HttpServletRequest httpRequest) {

        if (userId == null || userId.isEmpty()) {
            userId = "admin";
        }

        String userName = decodeUserName(userNameEncoded);
        log.info("DELETE /v1/api/admin/delegations/{} - User: {}, Name: {}", delegationId, userId, userName);

        String ipAddress = getClientIp(httpRequest);
        delegationService.deactivateDelegation(delegationId, userId, userName, ipAddress);
        return ApiResponse.success(null, "Delegation deactivated");
    }

    /**
     * X-User-Name Base64 decode.
     */
    private String decodeUserName(String encoded) {
        if (encoded == null || encoded.isEmpty()) {
            return "admin";
        }

        try {
            byte[] decodedBytes = Base64.getDecoder().decode(encoded);
            return new String(decodedBytes, StandardCharsets.UTF_8);
        } catch (Exception e) {
            log.warn("X-User-Name decode failed: {}", encoded, e);
            return "admin";
        }
    }

    /**
     * Client IP lookup.
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
