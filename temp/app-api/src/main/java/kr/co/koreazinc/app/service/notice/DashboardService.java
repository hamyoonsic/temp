package kr.co.koreazinc.app.service.notice;

import kr.co.koreazinc.app.dto.notice.dashboard.DashboardStatsDto;
import kr.co.koreazinc.temp.repository.notice.NoticeDashboardQueryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class DashboardService {

    private final NoticeDashboardQueryRepository dashboardQueryRepository;

    @Transactional(readOnly = true)
    public DashboardStatsDto getStats(Integer year, Integer month) {

        LocalDateTime startAt = null;
        LocalDateTime endAt = null;

        // year, month 둘 다 없으면 전체 기간
        if (year != null && month != null) {
            YearMonth ym = YearMonth.of(year, month);
            startAt = ym.atDay(1).atStartOfDay();
            endAt   = ym.atEndOfMonth().plusDays(1).atStartOfDay();  // [start, end)
        }

        // 1) 상태별 카운트
        List<Object[]> rows;
        long maintenanceCount;
        long completedCount;

        if (startAt == null) {
            rows = dashboardQueryRepository.getStatusCountsAll();
            maintenanceCount = dashboardQueryRepository.getMaintenanceCountAll();
            completedCount   = dashboardQueryRepository.getCompletedCountAll();
        } else {
            rows = dashboardQueryRepository.getStatusCountsInPeriod(startAt, endAt);
            maintenanceCount = dashboardQueryRepository.getMaintenanceCountInPeriod(startAt, endAt);
            completedCount   = dashboardQueryRepository.getCompletedCountInPeriod(startAt, endAt);
        }

        List<DashboardStatsDto.StatusCount> statusCounts =
                rows.stream()
                    .map(row -> DashboardStatsDto.StatusCount.builder()
                            .status((String) row[0])
                            .count((Long) row[1])
                            .build())
                    .collect(Collectors.toList());

        // 2) DTO로 묶어서 리턴
        return DashboardStatsDto.builder()
                .statusCounts(statusCounts)
                .maintenanceCount(maintenanceCount)
                .completedCount(completedCount)
                .build();
    }
}
