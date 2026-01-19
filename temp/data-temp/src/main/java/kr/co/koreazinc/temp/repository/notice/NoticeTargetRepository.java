package kr.co.koreazinc.temp.repository.notice;

import kr.co.koreazinc.temp.model.entity.notice.NoticeTarget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 공지 대상 Repository
 * 위치: temp/data-temp/src/main/java/kr/co/koreazinc/temp/repository/notice/NoticeTargetRepository.java
 */
@Repository
public interface NoticeTargetRepository extends JpaRepository<NoticeTarget, Long> {
    
    // 공지 ID로 대상 목록 조회
    List<NoticeTarget> findByNoticeId(Long noticeId);
    
    // 공지 ID와 대상 타입으로 조회
    List<NoticeTarget> findByNoticeIdAndTargetType(Long noticeId, String targetType);
    
    // 공지 ID로 대상 삭제
    void deleteByNoticeId(Long noticeId);
    
    // 특정 대상키를 가진 공지 ID 목록 조회
    List<NoticeTarget> findByTargetKey(String targetKey);
}
