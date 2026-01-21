package kr.co.koreazinc.temp.model.entity.admin;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * 관리자 권한 위임 엔티티
 * 위치: temp/data-temp/src/main/java/kr/co/koreazinc/temp/model/entity/admin/AdminDelegation.java
 */
@Entity
@Table(name = "admin_delegation")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDelegation {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "delegation_id")
    private Long delegationId;
    
    @Column(name = "delegator_user_id", nullable = false, length = 50)
    private String delegatorUserId;
    
    @Column(name = "delegator_user_nm", nullable = false, length = 100)
    private String delegatorUserNm;
    
    @Column(name = "delegate_user_id", nullable = false, length = 50)
    private String delegateUserId;
    
    @Column(name = "delegate_user_nm", nullable = false, length = 100)
    private String delegateUserNm;
    
    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;
    
    @Column(name = "end_date", nullable = false)
    private LocalDateTime endDate;
    
    @Column(name = "reason", length = 500)
    private String reason;
    
    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "created_by", nullable = false, length = 50)
    private String createdBy;
    
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    @Column(name = "updated_by", nullable = false, length = 50)
    private String updatedBy;
    
    /**
     * 현재 유효한 위임인지 확인
     */
    public boolean isCurrentlyValid() {
        if (!isActive) {
            return false;
        }
        
        LocalDateTime now = LocalDateTime.now();
        return !now.isBefore(startDate) && !now.isAfter(endDate);
    }
}