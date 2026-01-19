package kr.co.koreazinc.temp.model.entity.notice;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * 사용자 마스터 엔티티 (SSO 연동)
 * 위치: temp/data-temp/src/main/java/kr/co/koreazinc/temp/model/entity/notice/UserMaster.java
 */
@Entity
@Table(name = "user_master")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserMaster {
    
    @Id
    @Column(name = "user_id", length = 50)
    private String userId;
    
    @Column(name = "user_ko_nm", nullable = false, length = 100)
    private String userKoNm;
    
    @Column(name = "user_en_nm", length = 100)
    private String userEnNm;
    
    @Column(name = "email", length = 150)
    private String email;
    
    @Column(name = "org_unit_id")
    private Long orgUnitId;
    
    @Column(name = "corp_id")
    private Long corpId;
    
    @Column(name = "position", length = 50)
    private String position;
    
    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;
    
    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
