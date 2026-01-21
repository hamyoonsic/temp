package kr.co.koreazinc.temp.repository.notice;

import kr.co.koreazinc.temp.model.entity.notice.NoticeRecipient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 공지 수신자 Repository
 * 위치: temp/data-temp/src/main/java/kr/co/koreazinc/temp/repository/notice/NoticeRecipientRepository.java
 */
@Repository
public interface NoticeRecipientRepository extends JpaRepository<NoticeRecipient, Long> {
    
    /**
     * 공지 ID로 전체 수신자 조회
     */
    List<NoticeRecipient> findByNoticeIdOrderByCreatedAtAsc(Long noticeId);
    
    /**
     * 공지 ID와 사용자 ID로 조회
     */
    List<NoticeRecipient> findByNoticeIdAndUserId(Long noticeId, String userId);
    
    /**
     * 읽지 않은 공지 수 조회
     */
    @Query("SELECT COUNT(r) FROM NoticeRecipient r WHERE r.userId = :userId AND r.isRead = false")
    Long countUnreadByUserId(@Param("userId") String userId);
    
    /**
     * 사용자별 읽지 않은 공지 목록
     */
    List<NoticeRecipient> findByUserIdAndIsReadFalseOrderByCreatedAtDesc(String userId);
}