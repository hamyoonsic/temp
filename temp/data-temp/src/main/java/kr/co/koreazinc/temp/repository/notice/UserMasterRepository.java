package kr.co.koreazinc.temp.repository.notice;

import kr.co.koreazinc.temp.model.entity.notice.UserMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 사용자 마스터 Repository
 * user_master 테이블 기반
 */
@Repository
public interface UserMasterRepository extends JpaRepository<UserMaster, String> {

    // user_id 여러 개로 조회
    List<UserMaster> findByUserIdIn(List<String> userIds);

    // 특정 조직(ORG_UNIT) 내 활성 사용자
    List<UserMaster> findByOrgUnitIdAndIsActiveTrue(Long orgUnitId);

    // 특정 법인(CORP) 내 활성 사용자
    List<UserMaster> findByCorpIdAndIsActiveTrue(Long corpId);
}
