package kr.co.koreazinc.app.configuration;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * 메일 및 캘린더 발송 테스트 설정
 * 위치: temp/app-api/src/main/java/kr/co/koreazinc/app/configuration/MailTestProperty.java
 */
@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "notice.mail")
public class MailTestProperty {
    
    /**
     * 메일 테스트 모드 활성화
     * true: 실제 메일 발송 안함, 로그만 출력
     * false: 실제 메일 발송
     */
    private Boolean testMode = true;
    
    /**
     * 화이트리스트 모드 활성화
     * true: whitelistEmails에 있는 이메일만 발송
     * false: 모든 이메일 발송
     */
    private Boolean whitelistMode = false;
    
    /**
     * 발송 허용 이메일 목록 (화이트리스트)
     */
    private List<String> whitelistEmails = List.of();
    
    /**
     * 테스트용 대체 이메일
     * 테스트 모드일 때 실제 수신자 대신 이 이메일로만 발송
     */
    private String testRecipientEmail;
    
    //  캘린더 테스트 모드 추가
    /**
     * Outlook 캘린더 테스트 모드
     * true: 실제 캘린더 이벤트 생성 안함, 로그만 출력
     * false: 실제 캘린더 이벤트 생성
     */
    private Boolean calendarTestMode = true;
}