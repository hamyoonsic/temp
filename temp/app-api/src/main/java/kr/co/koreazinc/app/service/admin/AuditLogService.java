package kr.co.koreazinc.app.service.admin;

import kr.co.koreazinc.temp.model.entity.admin.AuditLog;
import kr.co.koreazinc.temp.repository.admin.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * 감사 로그 서비스
 * 위치: temp/app-api/src/main/java/kr/co/koreazinc/app/service/admin/AuditLogService.java
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuditLogService {
    
    private final AuditLogRepository auditLogRepository;
    
    /**
     * 감사 로그 생성
     */
    @Transactional
    public void createLog(
            String logType,
            String action,
            String targetType,
            String targetId,
            String userId,
            String userName,
            String ipAddress,
            String description,
            String result) {
        
        AuditLog auditLog  = AuditLog.builder()
                .logType(logType)
                .action(action)
                .targetType(targetType)
                .targetId(targetId)
                .userId(userId)
                .userName(userName)
                .ipAddress(ipAddress)
                .description(description)
                .result(result)
                .build();
        
        auditLogRepository.save(auditLog);
        log.info("Audit log created: {} - {} - {}", logType, action, description);
    }
    
    /**
     * 로그 타입별 조회
     */
    @Transactional(readOnly = true)
    public Page<AuditLog> getLogsByType(String logType, Pageable pageable) {
        return auditLogRepository.findByLogTypeOrderByCreatedAtDesc(logType, pageable);
    }
    
    /**
     * 사용자별 조회
     */
    @Transactional(readOnly = true)
    public Page<AuditLog> getLogsByUser(String userId, Pageable pageable) {
        return auditLogRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
    }
    
    /**
     * 기간별 조회
     */
    @Transactional(readOnly = true)
    public Page<AuditLog> getLogsByDateRange(
            LocalDateTime startDate,
            LocalDateTime endDate,
            Pageable pageable) {
        return auditLogRepository.findByCreatedAtBetweenOrderByCreatedAtDesc(
            startDate, endDate, pageable
        );
    }
}