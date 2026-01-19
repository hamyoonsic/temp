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
 * 법인 마스터 엔티티
 * 위치: temp/data-temp/src/main/java/kr/co/koreazinc/temp/model/entity/notice/CorporationMaster.java
 */
@Entity
@Table(name = "corporation_master")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CorporationMaster {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "corp_id")
    private Long corpId;
    
    @Column(name = "corp_code", nullable = false, unique = true, length = 50)
    private String corpCode;
    
    @Column(name = "corp_name", nullable = false, length = 100)
    private String corpName;
    
    @Column(name = "parent_corp_id")
    private Long parentCorpId;
    
    @Column(name = "business_number", length = 20)
    private String businessNumber;
    
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
