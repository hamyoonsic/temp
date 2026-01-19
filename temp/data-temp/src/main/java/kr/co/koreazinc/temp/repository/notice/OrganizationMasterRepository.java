package kr.co.koreazinc.temp.repository.notice;

import kr.co.koreazinc.temp.model.entity.notice.OrganizationMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 조직/부서 마스터 Repository
 * 위치: temp/data-temp/src/main/java/kr/co/koreazinc/temp/repository/notice/OrganizationMasterRepository.java
 */
@Repository
public interface OrganizationMasterRepository extends JpaRepository<OrganizationMaster, Long> {
    
    // 조직 코드로 조회
    Optional<OrganizationMaster> findByOrgUnitCode(String orgUnitCode);
    
    // 법인 ID로 조직 목록 조회
    List<OrganizationMaster> findByCorpIdAndIsActiveTrueOrderByDisplayOrder(Long corpId);
    
    // 활성화된 조직 목록 조회
    List<OrganizationMaster> findByIsActiveTrueOrderByDisplayOrder();
}
