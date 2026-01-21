package kr.co.koreazinc.temp.repository.notice;

import kr.co.koreazinc.temp.model.entity.notice.NoticeDeliveryLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 공지 발송 이력 Repository
 * 위치: temp/data-temp/src/main/java/kr/co/koreazinc/temp/repository/notice/NoticeDeliveryLogRepository.java
 */
@Repository
public interface NoticeDeliveryLogRepository extends JpaRepository<NoticeDeliveryLog, Long> {
    
    /**
     * 공지 ID로 발송 이력 조회
     */
    List<NoticeDeliveryLog> findByNoticeIdOrderByDeliveryIdDesc(Long noticeId);
    
    /**
     * 공지 ID와 상태로 최근 이력 조회
     */
    Optional<NoticeDeliveryLog> findTopByNoticeIdAndDeliveryStatusOrderByDeliveryIdDesc(
        Long noticeId, 
        String deliveryStatus
    );
    
    /**
     * 공지 ID로 최근 이력 조회
     */
    Optional<NoticeDeliveryLog> findTopByNoticeIdOrderByDeliveryIdDesc(Long noticeId);
    
    /**
     * 중복 발송 방지: idempotency key로 조회
     */
    Optional<NoticeDeliveryLog> findByIdempotencyKey(String idempotencyKey);
}