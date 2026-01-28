package kr.co.koreazinc.app.configuration;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * 서명 이미지 업로드 경로 설정
 * 위치: temp/app-api/src/main/java/kr/co/koreazinc/app/configuration/NoticeSignatureStorageProperty.java
 */
@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "notice.signature.storage")
public class NoticeSignatureStorageProperty {
    /**
     * FileUtils 시스템 명
     */
    private String systemName = "app";

    /**
     * FileUtils 법인/회사 코드
     */
    private String corporationName = "global";

    /**
     * 업로드 기본 경로
     */
    private String uploadPath = "notices/signatures";
}
