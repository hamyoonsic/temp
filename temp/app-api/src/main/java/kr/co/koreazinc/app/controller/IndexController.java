package kr.co.koreazinc.app.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import lombok.extern.slf4j.Slf4j;

/**
 * SPA (React) 라우팅 전담 컨트롤러
 * 
 * 역할:
 * - 모든 프론트엔드 라우팅 경로를 index.html로 forward
 * - API 요청(/api/**)과 정적 리소스(.js, .css 등)는 제외
 * 
 * 동작:
 * - / → index.html
 * - /notices/register → index.html (React Router 처리)
 * - /notices/history → index.html (React Router 처리)
 * - /api/notices → API Controller (우선 처리됨)
 * - /assets/index.js → static 리소스 (매칭 안 됨)
 */
@Slf4j
@Controller
public class IndexController {

    @GetMapping("/")
    public String root() {
        log.info(">>> [ROOT IndexController] SPA 요청 들어옴");
        return "forward:/index.html";
    }

    // React Router 경로만 명시적으로
    @GetMapping(value = {"/{path:[^\\.]*}", "/**/{path:[^\\.]*}"})
    public String spa() {
        return "forward:/index.html";
    }
}