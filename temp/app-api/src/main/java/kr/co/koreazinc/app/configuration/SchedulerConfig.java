package kr.co.koreazinc.app.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * 스케줄러 활성화 설정
 * 위치: temp/app-api/src/main/java/kr/co/koreazinc/app/configuration/SchedulerConfig.java
 */
@Configuration
@EnableScheduling
public class SchedulerConfig {
    // @EnableScheduling 어노테이션으로 스케줄러 기능 활성화
}