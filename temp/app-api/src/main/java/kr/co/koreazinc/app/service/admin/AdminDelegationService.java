package kr.co.koreazinc.app.service.admin;

import kr.co.koreazinc.app.dto.admin.AdminDelegationDto;
import kr.co.koreazinc.temp.model.entity.admin.AdminDelegation;
import kr.co.koreazinc.temp.model.entity.admin.AuditLog;
import kr.co.koreazinc.temp.repository.admin.AdminDelegationRepository;
import kr.co.koreazinc.temp.repository.admin.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 관리자 권한 위임 서비스
 * 위치: temp/app-api/src/main/java/kr/co/koreazinc/app/service/admin/AdminDelegationService.java
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AdminDelegationService {
    
    private final AdminDelegationRepository delegationRepository;
    private final AuditLogRepository auditLogRepository;
    
    /**
     * 위임 생성
     */
    @Transactional
    public AdminDelegationDto.Response createDelegation(
            String delegatorUserId,
            String delegatorUserNm,
            AdminDelegationDto.CreateRequest request,
            String ipAddress) {
        
        log.info("Creating admin delegation: {} -> {}", delegatorUserId, request.getDelegateUserId());
        
        // 기간 겹침 검증
        boolean hasOverlap = delegationRepository.existsOverlappingDelegation(
            delegatorUserId, 
            request.getStartDate(), 
            request.getEndDate()
        );
        
        if (hasOverlap) {
            throw new RuntimeException("해당 기간에 이미 활성화된 위임이 존재합니다.");
        }
        
        // 위임 생성
        AdminDelegation delegation = AdminDelegation.builder()
                .delegatorUserId(delegatorUserId)
                .delegatorUserNm(delegatorUserNm)
                .delegateUserId(request.getDelegateUserId())
                .delegateUserNm(request.getDelegateUserNm())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .reason(request.getReason())
                .isActive(true)
                .createdBy(delegatorUserId)
                .updatedBy(delegatorUserId)
                .build();
        
        AdminDelegation saved = delegationRepository.save(delegation);
        
        // 감사 로그 기록
        auditLogRepository.save(AuditLog.builder()
                .logType(AuditLog.LogType.ADMIN_DELEGATION)
                .action(AuditLog.Action.CREATE)
                .targetType("DELEGATION")
                .targetId(String.valueOf(saved.getDelegationId()))
                .userId(delegatorUserId)
                .userName(delegatorUserNm)
                .ipAddress(ipAddress)
                .description(String.format("관리자 권한 위임: %s → %s (%s ~ %s)",
                    delegatorUserNm, request.getDelegateUserNm(),
                    request.getStartDate(), request.getEndDate()))
                .newValue(String.format("Reason: %s", request.getReason()))
                .result(AuditLog.Result.SUCCESS)
                .build());
        
        return convertToResponse(saved);
    }
    
    /**
     * 위임 목록 조회 (위임자 기준)
     */
    @Transactional(readOnly = true)
    public List<AdminDelegationDto.Response> getDelegationsByDelegator(String delegatorUserId) {
        List<AdminDelegation> delegations = delegationRepository
                .findByDelegatorUserIdAndIsActiveTrueOrderByCreatedAtDesc(delegatorUserId);
        
        return delegations.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * 현재 유효한 위임 조회 (대리자 기준)
     */
    @Transactional(readOnly = true)
    public AdminDelegationDto.Response getCurrentActiveDelegation(String delegateUserId) {
        return delegationRepository
                .findCurrentActiveDelegationByDelegateUserId(delegateUserId, LocalDateTime.now())
                .map(this::convertToResponse)
                .orElse(null);
    }
    
    /**
     * 특정 사용자가 현재 관리자 권한을 가지고 있는지 확인
     * (원래 관리자이거나 대리 관리자인 경우)
     */
    @Transactional(readOnly = true)
    public boolean hasAdminPermission(String userId, String ttlCd) {
        // 1. 원래 관리자 권한 확인 (ttlCd = HR150138)
        if ("HR150138".equals(ttlCd)) {
            return true;
        }
        
        // 2. 대리 관리자 권한 확인
        return delegationRepository
                .findCurrentActiveDelegationByDelegateUserId(userId, LocalDateTime.now())
                .isPresent();
    }
    
    /**
     * 위임 비활성화
     */
    @Transactional
    public void deactivateDelegation(Long delegationId, String userId, String userName, String ipAddress) {
        AdminDelegation delegation = delegationRepository.findById(delegationId)
                .orElseThrow(() -> new RuntimeException("위임 정보를 찾을 수 없습니다."));
        
        delegation.setIsActive(false);
        delegation.setUpdatedBy(userId);
        
        delegationRepository.save(delegation);
        
        // 감사 로그 기록
        auditLogRepository.save(AuditLog.builder()
                .logType(AuditLog.LogType.ADMIN_DELEGATION)
                .action(AuditLog.Action.UPDATE)
                .targetType("DELEGATION")
                .targetId(String.valueOf(delegationId))
                .userId(userId)
                .userName(userName)
                .ipAddress(ipAddress)
                .description("관리자 권한 위임 비활성화")
                .result(AuditLog.Result.SUCCESS)
                .build());
    }
    
    /**
     * Entity -> DTO 변환
     */
    private AdminDelegationDto.Response convertToResponse(AdminDelegation delegation) {
        return AdminDelegationDto.Response.builder()
                .delegationId(delegation.getDelegationId())
                .delegatorUserId(delegation.getDelegatorUserId())
                .delegatorUserNm(delegation.getDelegatorUserNm())
                .delegateUserId(delegation.getDelegateUserId())
                .delegateUserNm(delegation.getDelegateUserNm())
                .startDate(delegation.getStartDate())
                .endDate(delegation.getEndDate())
                .reason(delegation.getReason())
                .isActive(delegation.getIsActive())
                .isCurrentlyValid(delegation.isCurrentlyValid())
                .createdAt(delegation.getCreatedAt())
                .createdBy(delegation.getCreatedBy())
                .build();
    }
}