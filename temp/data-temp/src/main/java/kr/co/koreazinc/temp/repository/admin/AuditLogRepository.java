package kr.co.koreazinc.temp.repository.admin;

import kr.co.koreazinc.temp.model.entity.admin.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 감사 로그 Repository
 * 위치: temp/data-temp/src/main/java/kr/co/koreazinc/temp/repository/admin/AuditLogRepository.java
 */
@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    
    /**
     * 로그 타입별 조회
     */
    Page<AuditLog> findByLogTypeOrderByCreatedAtDesc(String logType, Pageable pageable);
    
    /**
     * 사용자별 조회
     */
    Page<AuditLog> findByUserIdOrderByCreatedAtDesc(String userId, Pageable pageable);
    
    /**
     * 대상 타입과 ID로 조회
     */
    List<AuditLog> findByTargetTypeAndTargetIdOrderByCreatedAtDesc(String targetType, String targetId);
    
    /**
     * 기간별 조회
     */
    Page<AuditLog> findByCreatedAtBetweenOrderByCreatedAtDesc(
        LocalDateTime startDate, 
        LocalDateTime endDate, 
        Pageable pageable
    );
    
    /**
     * 로그 타입과 기간으로 조회
     */
    Page<AuditLog> findByLogTypeAndCreatedAtBetweenOrderByCreatedAtDesc(
        String logType,
        LocalDateTime startDate,
        LocalDateTime endDate,
        Pageable pageable
    );
}