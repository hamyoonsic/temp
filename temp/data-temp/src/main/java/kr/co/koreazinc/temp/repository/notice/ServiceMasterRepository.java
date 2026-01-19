package kr.co.koreazinc.temp.repository.notice;

import kr.co.koreazinc.temp.model.entity.notice.ServiceMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 서비스 마스터 Repository
 * 위치: temp/data-temp/src/main/java/kr/co/koreazinc/temp/repository/notice/ServiceMasterRepository.java
 */
@Repository
public interface ServiceMasterRepository extends JpaRepository<ServiceMaster, Long> {
    
    // 서비스 코드로 조회
    Optional<ServiceMaster> findByServiceCode(String serviceCode);
    
    // 활성화된 서비스 목록 조회
    List<ServiceMaster> findByIsActiveTrueOrderByDisplayOrder();
    
    // 카테고리별 서비스 조회
    List<ServiceMaster> findByServiceCategoryAndIsActiveTrueOrderByDisplayOrder(String category);
}
