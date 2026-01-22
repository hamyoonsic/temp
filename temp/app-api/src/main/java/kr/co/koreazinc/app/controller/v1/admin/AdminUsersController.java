package kr.co.koreazinc.app.controller.v1.admin;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import kr.co.koreazinc.app.dto.admin.AdminUserDto;
import kr.co.koreazinc.app.dto.notice.ApiResponse;
import kr.co.koreazinc.temp.model.entity.notice.CorporationMaster;
import kr.co.koreazinc.temp.model.entity.notice.OrganizationMaster;
import kr.co.koreazinc.temp.model.entity.notice.UserMaster;
import kr.co.koreazinc.temp.repository.admin.AdminDelegationRepository;
import kr.co.koreazinc.temp.repository.notice.CorporationMasterRepository;
import kr.co.koreazinc.temp.repository.notice.OrganizationMasterRepository;
import kr.co.koreazinc.temp.repository.notice.UserMasterRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.time.LocalDateTime;

/**
 * Admin user controller.
 */
@Slf4j
@RestController
@RequestMapping("/v1/api/admin/users")
@RequiredArgsConstructor
@Tag(name = "Admin Users", description = "Admin user lookup APIs")
public class AdminUsersController {

    private final UserMasterRepository userMasterRepository;
    private final OrganizationMasterRepository organizationMasterRepository;
    private final CorporationMasterRepository corporationMasterRepository;
    private final AdminDelegationRepository adminDelegationRepository;

    /**
     * Admin user list (uses user_master as source).
     * GET /v1/api/admin/users?ttlCd=HR150138
     */
    @GetMapping
    @Operation(summary = "Admin user list", description = "Returns active users from user_master")
    public ApiResponse<List<AdminUserDto>> getAdminUsers(
            @RequestParam(required = false) String ttlCd,
            @RequestHeader(value = "X-User-Id", required = false) String currentUserId) {

        log.info("GET /v1/api/admin/users - ttlCd: {}, currentUserId: {}", ttlCd, currentUserId);

        List<UserMaster> users = userMasterRepository.findByIsActiveTrueOrderByUserKoNmAsc();
        Map<Long, OrganizationMaster> orgMap = organizationMasterRepository
                .findByIsActiveTrueOrderByDisplayOrder()
                .stream()
                .collect(Collectors.toMap(OrganizationMaster::getOrgUnitId, Function.identity(), (a, b) -> a));

        Map<Long, CorporationMaster> corpMap = corporationMasterRepository
                .findByIsActiveTrueOrderByDisplayOrder()
                .stream()
                .collect(Collectors.toMap(CorporationMaster::getCorpId, Function.identity(), (a, b) -> a));

        List<AdminUserDto> results = users.stream()
                .map(user -> toDto(user, orgMap, corpMap, currentUserId))
                .collect(Collectors.toList());

        return ApiResponse.success(results);
    }

    /**
     * Admin permission check (temporary userId-based).
     * GET /v1/api/admin/users/{userId}/permission
     */
    @GetMapping("/{userId}/permission")
    @Operation(summary = "Admin permission check", description = "Checks admin permission by userId")
    public ApiResponse<Boolean> checkAdminPermission(@PathVariable String userId) {
        log.info("GET /v1/api/admin/users/{}/permission", userId);

        boolean hasPermission = AdminUsersPermission.isAdminUser(userId)
                || adminDelegationRepository
                        .findCurrentActiveDelegationByDelegateUserId(userId, LocalDateTime.now())
                        .isPresent();
        return ApiResponse.success(hasPermission);
    }

    private AdminUserDto toDto(
            UserMaster user,
            Map<Long, OrganizationMaster> orgMap,
            Map<Long, CorporationMaster> corpMap,
            String currentUserId) {

        OrganizationMaster org = user.getOrgUnitId() != null ? orgMap.get(user.getOrgUnitId()) : null;
        CorporationMaster corp = user.getCorpId() != null ? corpMap.get(user.getCorpId()) : null;

        return AdminUserDto.builder()
                .userId(user.getUserId())
                .userKoNm(user.getUserKoNm())
                .userEnNm(user.getUserEnNm())
                .email(user.getEmail())
                .deptCd(org != null ? org.getOrgUnitCode() : null)
                .deptNm(org != null ? org.getOrgUnitName() : null)
                .coCd(corp != null ? corp.getCorpCode() : null)
                .coNm(corp != null ? corp.getCorpName() : null)
                .ttlCd(null)
                .ttlNm(null)
                .posCd(null)
                .posNm(user.getPosition())
                .isCurrentUser(user.getUserId() != null && user.getUserId().equals(currentUserId))
                .build();
    }

    /**
     * Temporary admin permission mapping.
     */
    private static final class AdminUsersPermission {
        private static final java.util.Set<String> ADMIN_USER_IDS = java.util.Set.of(
                "hamyoonsic"
        );

        private static boolean isAdminUser(String userId) {
            return ADMIN_USER_IDS.contains(userId);
        }
    }
}
