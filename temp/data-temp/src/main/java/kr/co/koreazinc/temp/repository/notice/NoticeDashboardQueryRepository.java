//단순 CRUD가 아닌 복잡한 쿼리 처리를 위한 Repository
package kr.co.koreazinc.temp.repository.notice;

import kr.co.koreazinc.temp.model.entity.notice.NoticeBase;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class NoticeDashboardQueryRepository {

    @PersistenceContext
    private final EntityManager em;

    // 1) 기간 없이(전체)
    public List<Object[]> getStatusCountsAll() {
        return em.createQuery("""
                select n.noticeStatus, count(n)
                from NoticeBase n
                group by n.noticeStatus
                """, Object[].class)
            .getResultList();
    }

    // 2) 기간 있는 경우
    public List<Object[]> getStatusCountsInPeriod(LocalDateTime startAt, LocalDateTime endAt) {
        return em.createQuery("""
                select n.noticeStatus, count(n)
                from NoticeBase n
                where n.publishStartAt >= :startAt
                  and n.publishStartAt <  :endAt
                group by n.noticeStatus
                """, Object[].class)
            .setParameter("startAt", startAt)
            .setParameter("endAt", endAt)
            .getResultList();
    }

    public long getMaintenanceCountAll() {
        return em.createQuery("""
                select count(n)
                from NoticeBase n
                where n.isMaintenance = true
                """, Long.class)
            .getSingleResult();
    }

    public long getMaintenanceCountInPeriod(LocalDateTime startAt, LocalDateTime endAt) {
        return em.createQuery("""
                select count(n)
                from NoticeBase n
                where n.isMaintenance = true
                  and n.publishStartAt >= :startAt
                  and n.publishStartAt <  :endAt
                """, Long.class)
            .setParameter("startAt", startAt)
            .setParameter("endAt", endAt)
            .getSingleResult();
    }

    public long getCompletedCountAll() {
        return em.createQuery("""
                select count(n)
                from NoticeBase n
                where n.isCompleted = true
                """, Long.class)
            .getSingleResult();
    }

    public long getCompletedCountInPeriod(LocalDateTime startAt, LocalDateTime endAt) {
        return em.createQuery("""
                select count(n)
                from NoticeBase n
                where n.isCompleted = true
                  and n.publishStartAt >= :startAt
                  and n.publishStartAt <  :endAt
                """, Long.class)
            .setParameter("startAt", startAt)
            .setParameter("endAt", endAt)
            .getSingleResult();
    }
}
