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
 * 조직/부서 마스터 엔티티
 * 위치: temp/data-temp/src/main/java/kr/co/koreazinc/temp/model/entity/notice/OrganizationMaster.java
 */
@Entity
@Table(name = "organization_master")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrganizationMaster {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "org_unit_id")
    private Long orgUnitId;
    
    @Column(name = "org_unit_code", nullable = false, unique = true, length = 50)
    private String orgUnitCode;
    
    @Column(name = "org_unit_name", nullable = false, length = 100)
    private String orgUnitName;
    
    @Column(name = "corp_id", nullable = false)
    private Long corpId;
    
    @Column(name = "parent_org_unit_id")
    private Long parentOrgUnitId;
    
    @Column(name = "org_level", nullable = false)
    @Builder.Default
    private Integer orgLevel = 1;
    
    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;
    
    @Column(name = "display_order", nullable = false)
    @Builder.Default
    private Integer displayOrder = 0;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
