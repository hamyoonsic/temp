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
 * 서비스 마스터 엔티티 (ERP, 그룹웨어 등)
 * 위치: temp/data-temp/src/main/java/kr/co/koreazinc/temp/model/entity/notice/ServiceMaster.java
 */
@Entity
@Table(name = "service_master")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ServiceMaster {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "service_id")
    private Long serviceId;
    
    @Column(name = "service_code", nullable = false, unique = true, length = 50)
    private String serviceCode;
    
    @Column(name = "service_name", nullable = false, length = 100)
    private String serviceName;
    
    @Column(name = "service_category", length = 50)
    private String serviceCategory;
    
    @Column(name = "owner_org_unit_id", length = 50)
    private String ownerOrgUnitId;
    
    @Column(name = "contact_info", length = 200)
    private String contactInfo;
    
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
