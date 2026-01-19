package kr.co.koreazinc.temp.repository.notice;

import kr.co.koreazinc.temp.model.entity.notice.NoticeBase;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 공지 기본 정보 Repository
 * 위치: temp/data-temp/src/main/java/kr/co/koreazinc/temp/repository/notice/NoticeBaseRepository.java
 */
@Repository
public interface NoticeBaseRepository extends JpaRepository<NoticeBase, Long>, 
                                               JpaSpecificationExecutor<NoticeBase> {
    
    // 상태별 조회
    Page<NoticeBase> findByNoticeStatusOrderByCreatedAtDesc(String status, Pageable pageable);
    
    // 중요도별 조회
    Page<NoticeBase> findByNoticeLevelOrderByCreatedAtDesc(NoticeBase.NoticeLevel level, Pageable pageable);
    
    // 전체 조회 (최신순)
    Page<NoticeBase> findAllByOrderByCreatedAtDesc(Pageable pageable);
    
    // 제목 검색
    Page<NoticeBase> findByTitleContainingOrderByCreatedAtDesc(String title, Pageable pageable);
    
    // 날짜 범위 조회
    @Query("SELECT n FROM NoticeBase n WHERE n.createdAt BETWEEN :startDate AND :endDate ORDER BY n.createdAt DESC")
    Page<NoticeBase> findByCreatedAtBetween(
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate,
        Pageable pageable
    );
    
    // 상태별 카운트
    Long countByNoticeStatus(String status);
    
    // 발송 일정 범위 조회
    @Query("SELECT n FROM NoticeBase n WHERE n.publishStartAt BETWEEN :startDate AND :endDate")
    List<NoticeBase> findByPublishDateRange(
        @Param("startDate") LocalDateTime startDate, 
        @Param("endDate") LocalDateTime endDate
    );
    
    // 최근 공지 조회 (상위 N개)
    List<NoticeBase> findTop10ByOrderByCreatedAtDesc();
}
