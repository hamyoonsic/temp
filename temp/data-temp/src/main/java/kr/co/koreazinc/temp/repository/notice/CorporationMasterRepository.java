package kr.co.koreazinc.temp.repository.notice;

import kr.co.koreazinc.temp.model.entity.notice.CorporationMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 법인 마스터 Repository
 * 위치: temp/data-temp/src/main/java/kr/co/koreazinc/temp/repository/notice/CorporationMasterRepository.java
 */
@Repository
public interface CorporationMasterRepository extends JpaRepository<CorporationMaster, Long> {
    
    // 법인 코드로 조회
    Optional<CorporationMaster> findByCorpCode(String corpCode);
    
    // 활성화된 법인 목록 조회
    List<CorporationMaster> findByIsActiveTrueOrderByDisplayOrder();
}
