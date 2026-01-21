package kr.co.koreazinc.app.controller.v1.admin;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import kr.co.koreazinc.app.dto.admin.AdminUserDto;
import kr.co.koreazinc.app.dto.notice.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

/**
 * 관리자 사용자 Controller
 * 위치: temp/app-api/src/main/java/kr/co/koreazinc/app/controller/v1/admin/AdminUsersController.java
 * 
 * ⚠️ 주의: 실제 환경에서는 SSO API 또는 user_master 테이블에서 조회해야 합니다.
 * 현재는 샘플 데이터로 구현되어 있습니다.
 */
@Slf4j
@RestController
@RequestMapping("/v1/api/admin/users")
@RequiredArgsConstructor
@Tag(name = "관리자 사용자", description = "관리자 권한자 정보 조회 API")
public class AdminUsersController {
    
    /**
     * HR150138 권한자 목록 조회
     * GET /v1/api/admin/users?ttlCd=HR150138
     * 
     * ⚠️ 실제 구현 시:
     * 1. SSO API 호출하여 ttlCd=HR150138인 사용자 목록 조회
     * 2. 또는 user_master 테이블 조인하여 조회
     * 3. 현재는 샘플 데이터 반환
     */
    @GetMapping
    @Operation(summary = "관리자 권한자 목록 조회", 
               description = "ttlCd로 필터링된 관리자 권한자 목록을 조회합니다")
    public ApiResponse<List<AdminUserDto>> getAdminUsers(
            @RequestParam(required = false) String ttlCd,
            @RequestHeader(value = "X-User-Id", required = false) String currentUserId) {
        
        log.info("GET /v1/api/admin/users - ttlCd: {}, currentUserId: {}", ttlCd, currentUserId);
        
        // ⚠️ TODO: 실제 환경에서는 SSO API 또는 DB에서 조회
        List<AdminUserDto> adminUsers = getSampleAdminUsers(currentUserId);
        
        // ttlCd 필터링
        if (ttlCd != null && !ttlCd.isEmpty()) {
            adminUsers = adminUsers.stream()
                    .filter(user -> ttlCd.equals(user.getTtlCd()))
                    .toList();
        }
        
        return ApiResponse.success(adminUsers);
    }
    
    /**
     * ⚠️ 샘플 데이터 생성 메서드
     * 실제 환경에서는 이 메서드를 제거하고 SSO API 또는 DB 조회로 대체
     */
    private List<AdminUserDto> getSampleAdminUsers(String currentUserId) {
        List<AdminUserDto> users = new ArrayList<>();
        
        // 샘플 관리자 사용자 데이터
        users.add(AdminUserDto.builder()
                .userId("tpdls7080")
                .userKoNm("박세인")
                .userEnNm("Sein Park")
                .email("tpdls7080@koreazinc.co.kr")
                .deptCd("00282")
                .deptNm("IT개발팀")
                .coCd("KZT")
                .coNm("케이지트레이딩")
                .ttlCd("HR150138")
                .ttlNm("선임")
                .posCd("HR151120")
                .posNm("선임")
                .isCurrentUser("tpdls7080".equals(currentUserId))
                .build());
        
        users.add(AdminUserDto.builder()
                .userId("park001")
                .userKoNm("박경민")
                .userEnNm("Park Kyung-min")
                .email("park.km@koreazinc.co.kr")
                .deptCd("00001")
                .deptNm("경영지원팀")
                .coCd("KZ")
                .coNm("고려아연")
                .ttlCd("HR150138")
                .ttlNm("선임")
                .posCd("HR151140")
                .posNm("수석")
                .isCurrentUser("park001".equals(currentUserId))
                .build());
        
        users.add(AdminUserDto.builder()
                .userId("shin001")
                .userKoNm("신호용")
                .userEnNm("Shin Ho-yong")
                .email("shin.hy@koreazinc.co.kr")
                .deptCd("00002")
                .deptNm("IT인프라팀")
                .coCd("KZ")
                .coNm("고려아연")
                .ttlCd("HR150138")
                .ttlNm("선임")
                .posCd("HR151120")
                .posNm("책임")
                .isCurrentUser("shin001".equals(currentUserId))
                .build());
        
        users.add(AdminUserDto.builder()
                .userId("jeon001")
                .userKoNm("전종하")
                .userEnNm("Jeon Jong-ha")
                .email("jeon.jh@koreazinc.co.kr")
                .deptCd("00282")
                .deptNm("IT개발팀")
                .coCd("KZ")
                .coNm("고려아연")
                .ttlCd("HR150138")
                .ttlNm("선임")
                .posCd("HR151120")
                .posNm("책임")
                .isCurrentUser("jeon001".equals(currentUserId))
                .build());
        
        return users;
    }
    
    /**
     * 특정 사용자의 관리자 권한 확인
     * GET /v1/api/admin/users/{userId}/permission
     */
    @GetMapping("/{userId}/permission")
    @Operation(summary = "관리자 권한 확인", 
               description = "특정 사용자가 관리자 권한을 가지고 있는지 확인합니다")
    public ApiResponse<Boolean> checkAdminPermission(@PathVariable String userId) {
        log.info("GET /v1/api/admin/users/{}/permission", userId);
        
        // ⚠️ TODO: 실제 환경에서는 SSO API 조회 또는 AdminDelegationService 활용
        List<AdminUserDto> adminUsers = getSampleAdminUsers(null);
        boolean hasPermission = adminUsers.stream()
                .anyMatch(user -> user.getUserId().equals(userId) && "HR150138".equals(user.getTtlCd()));
        
        return ApiResponse.success(hasPermission);
    }
}