package kr.co.koreazinc.temp.repository.notice;

import kr.co.koreazinc.temp.model.entity.notice.NoticeCalendarEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Outlook 캘린더 이벤트 Repository
 * 위치: temp/data-temp/src/main/java/kr/co/koreazinc/temp/repository/notice/NoticeCalendarEventRepository.java
 */
@Repository
public interface NoticeCalendarEventRepository extends JpaRepository<NoticeCalendarEvent, Long> {
    
    /**
     * 공지 ID로 캘린더 이벤트 조회
     */
    Optional<NoticeCalendarEvent> findByNoticeId(Long noticeId);
    
    /**
     * Provider Event ID로 조회
     */
    Optional<NoticeCalendarEvent> findByProviderEventId(String providerEventId);

    /**
     * 공지 ID + 캘린더 소유자(메일함) 기준 조회
     */
    Optional<NoticeCalendarEvent> findByNoticeIdAndResourceMailbox(Long noticeId, String resourceMailbox);
    
    /**
     * 공지 ID 목록으로 이벤트 조회
     */
    List<NoticeCalendarEvent> findByNoticeIdIn(List<Long> noticeIds);
}
