package kr.co.koreazinc.temp.repository.notice;

import kr.co.koreazinc.temp.model.entity.notice.NoticeSendPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * 공지 발송 계획 Repository
 * 위치: temp/data-temp/src/main/java/kr/co/koreazinc/temp/repository/notice/NoticeSendPlanRepository.java
 */
@Repository
public interface NoticeSendPlanRepository extends JpaRepository<NoticeSendPlan, Long> {
    
    /**
     * 공지 ID로 발송 계획 조회
     */
    Optional<NoticeSendPlan> findByNoticeId(Long noticeId);
    
    /**
     * 특정 시간대에 발송 예정인 계획 조회 (묶음 발송용)
     * 
     * @param startTime 시작 시간 (예: 2026-01-21 09:00:00)
     * @param endTime 종료 시간 (예: 2026-01-21 09:00:59)
     * @return 해당 시간대 발송 예정 목록
     */
    @Query("""
        SELECT sp FROM NoticeSendPlan sp
        WHERE sp.sendMode = 'SCHEDULED'
        AND sp.scheduledSendAt >= :startTime
        AND sp.scheduledSendAt < :endTime
        ORDER BY sp.scheduledSendAt ASC
    """)
    List<NoticeSendPlan> findScheduledPlansInTimeRange(
        @Param("startTime") LocalDateTime startTime,
        @Param("endTime") LocalDateTime endTime
    );

    /**
     * 현재 시각까지 도래한 스케줄 발송 계획 조회
     */
    @Query("""
        SELECT sp FROM NoticeSendPlan sp
        WHERE sp.sendMode = 'SCHEDULED'
        AND sp.scheduledSendAt <= :now
        ORDER BY sp.scheduledSendAt ASC
    """)
    List<NoticeSendPlan> findDueScheduledPlans(@Param("now") LocalDateTime now);
    
    /**
     * 즉시 발송 계획 조회
     */
    List<NoticeSendPlan> findBySendMode(String sendMode);
}
