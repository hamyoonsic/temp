package kr.co.koreazinc.temp.repository.admin;

import kr.co.koreazinc.temp.model.entity.admin.AdminDelegation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * 관리자 권한 위임 Repository
 * 위치: temp/data-temp/src/main/java/kr/co/koreazinc/temp/repository/admin/AdminDelegationRepository.java
 */
@Repository
public interface AdminDelegationRepository extends JpaRepository<AdminDelegation, Long> {
    
    /**
     * 위임자의 활성화된 위임 목록 조회
     */
    List<AdminDelegation> findByDelegatorUserIdAndIsActiveTrueOrderByCreatedAtDesc(String delegatorUserId);
    
    /**
     * 대리자의 활성화된 위임 목록 조회
     */
    List<AdminDelegation> findByDelegateUserIdAndIsActiveTrueOrderByCreatedAtDesc(String delegateUserId);
    
    /**
     * 특정 사용자의 현재 유효한 위임 조회
     * (대리자로서 현재 권한을 받고 있는지 확인)
     */
    @Query("SELECT d FROM AdminDelegation d WHERE d.delegateUserId = :userId " +
           "AND d.isActive = true " +
           "AND d.startDate <= :now " +
           "AND d.endDate >= :now")
    Optional<AdminDelegation> findCurrentActiveDelegationByDelegateUserId(
        @Param("userId") String userId,
        @Param("now") LocalDateTime now
    );
    
    /**
     * 위임자의 현재 유효한 위임 조회
     * (위임자가 현재 누군가에게 권한을 위임했는지 확인)
     */
    @Query("SELECT d FROM AdminDelegation d WHERE d.delegatorUserId = :userId " +
           "AND d.isActive = true " +
           "AND d.startDate <= :now " +
           "AND d.endDate >= :now")
    Optional<AdminDelegation> findCurrentActiveDelegationByDelegatorUserId(
        @Param("userId") String userId,
        @Param("now") LocalDateTime now
    );
    
    /**
     * 기간이 겹치는 위임이 있는지 확인
     */
    @Query("SELECT COUNT(d) > 0 FROM AdminDelegation d WHERE d.delegatorUserId = :delegatorUserId " +
           "AND d.isActive = true " +
           "AND ((d.startDate <= :endDate AND d.endDate >= :startDate))")
    boolean existsOverlappingDelegation(
        @Param("delegatorUserId") String delegatorUserId,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
}