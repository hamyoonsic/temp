package kr.co.koreazinc.temp.model.entity.notice;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 공지 대상 엔티티 (법인/부서/사용자)
 * 위치: temp/data-temp/src/main/java/kr/co/koreazinc/temp/model/entity/notice/NoticeTarget.java
 */
@Entity
@Table(name = "notice_target")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NoticeTarget {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "target_id")
    private Long targetId;
    
    @Column(name = "notice_id", nullable = false)
    private Long noticeId;
    
    @Column(name = "target_type", nullable = false, length = 20)
    private String targetType;  // CORP, ORG_UNIT, USER
    
    @Column(name = "target_key", nullable = false, length = 80)
    private String targetKey;
    
    @Column(name = "target_name", length = 200)
    private String targetName;
}
