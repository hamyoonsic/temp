package kr.co.koreazinc.app.controller.v1.notice;

import kr.co.koreazinc.app.dto.notice.ApiResponse;
import kr.co.koreazinc.app.dto.notice.dashboard.DashboardStatsDto;
import kr.co.koreazinc.app.service.notice.DashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/v1/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    /**
     * 통계 조회
     * 예) GET /v1/api/dashboard/stats?year=2025&month=10
     */
    @GetMapping("/stats")
    public ApiResponse<DashboardStatsDto> getDashboardStats(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month) {

        DashboardStatsDto stats = dashboardService.getStats(year, month);
        return ApiResponse.success(stats);
    }
}
