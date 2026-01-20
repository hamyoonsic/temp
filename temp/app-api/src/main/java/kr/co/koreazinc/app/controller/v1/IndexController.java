package kr.co.koreazinc.app.controller.v1;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Hidden;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


// 헬스 체크용
// 버전 정보 리턴
// API 문서 링크 안내
// 실제 비즈니스 도메인(공지, 사용자, 승인 등)은 전부 개별 컨트롤러로 빼서 사용

@Slf4j
@RestController
@RequestMapping("/v1")
@RequiredArgsConstructor
public class IndexController {

    @Hidden
    @GetMapping
    public String index() {
        log.info(">>> [V1 IndexController] /api/v1/ping 요청 들어옴");
        return "Temp API - V1";
    }
}
