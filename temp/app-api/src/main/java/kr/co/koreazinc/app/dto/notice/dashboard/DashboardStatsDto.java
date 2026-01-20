package kr.co.koreazinc.app.dto.notice.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDto {

    // 상태별 건수 (예: DRAFT, PENDING, APPROVED ...)
    private List<StatusCount> statusCounts;

    // 점검 공지 수
    private long maintenanceCount;

    // 완료 공지 수
    private long completedCount;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StatusCount {
        private String status;   // notice_status 값 그대로
        private long count;
    }
}
