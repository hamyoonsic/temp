# 🔧 OAuth2Property 오류 수정 완료

## ❌ 문제점

3개 서비스 파일에서 다음 오류 발생:
```
OAuth2Property.Credentials cannot be resolved to a type
credentials cannot be resolved or is not a field
```

**원인**: `OAuth2Property.Credentials` (복수형)는 존재하지 않음

## ✅ 해결 방법

### spring-core OAuth2Property 구조

```java
@ConfigurationProperties(prefix = "spring.security.oauth2")
public class OAuth2Property {
    private Map<String, Provider> provider;
    
    // 개별 Credential을 가져오는 메서드
    public Credential getCredential(String key) {
        return Credential.builder()
            .baseUrl(getProvider(key).getBaseUrl())
            .tokenUrl(getProvider(key).getTokenUrl())
            .clientId(this.getClient().getId())
            .scope(getProvider(key).getScope())
            .build();
    }
}
```

### 수정 내용

#### 1. NoticeMailService.java

**수정 전:**
```java
private final OAuth2Property.Credentials credentials;

// 사용
MailUtils.remoteSend(credentials.getMessage(), mailInfo);
```

**수정 후:**
```java
private final OAuth2Property oauth2Property;

// 사용
MailUtils.remoteSend(oauth2Property.getCredential("message"), mailInfo);
```

#### 2. NoticeAttachmentService.java

**수정 전:**
```java
private final OAuth2Property.Credentials credentials;

// 업로드
FileUtils.remoteUpload(credentials.getFile(), fileInfo);

// 다운로드
FileUtils.remoteDownload(credentials.getFile(), fileInfo);
```

**수정 후:**
```java
private final OAuth2Property oauth2Property;

// 업로드
FileUtils.remoteUpload(oauth2Property.getCredential("file"), fileInfo);

// 다운로드
FileUtils.remoteDownload(oauth2Property.getCredential("file"), fileInfo);
```

#### 3. OutlookCalendarService.java

**수정 전:**
```java
private final OAuth2Property.Credentials credentials;

// 토큰 발급
String token = OAuthUtils.issuedToken(
    credentials.getMicrosoft().getTokenUrl(),
    credentials.getMicrosoft().getClientId(),
    credentials.getMicrosoft().getClientSecret(),
    credentials.getMicrosoft().getScope()
);
```

**수정 후:**
```java
private final OAuth2Property oauth2Property;

// 토큰 발급
OAuth2Property.Credential microsoftCredential = oauth2Property.getCredential("microsoft");
String token = OAuthUtils.issuedToken(
    microsoftCredential.getTokenUrl(),
    microsoftCredential.getClientId(),
    microsoftCredential.getClientSecret(),
    microsoftCredential.getScope()
);
```

---

## 📝 사용 가능한 Provider Key

custom-spring-core-local.yaml에 정의된 provider 목록:

```yaml
spring:
  security:
    oauth2:
      provider:
        microsoft:      # oauth2Property.getCredential("microsoft")
        auth:          # oauth2Property.getCredential("auth")
        file:          # oauth2Property.getCredential("file")
        message:       # oauth2Property.getCredential("message")
        hr:            # oauth2Property.getCredential("hr")
        gw:            # oauth2Property.getCredential("gw")
```

---

## 🎯 핵심 정리

### ✅ 올바른 방법
```java
@Service
@RequiredArgsConstructor
public class MyService {
    private final OAuth2Property oauth2Property;
    
    public void doSomething() {
        // Provider별로 Credential 가져오기
        OAuth2Property.Credential fileCredential = oauth2Property.getCredential("file");
        OAuth2Property.Credential messageCredential = oauth2Property.getCredential("message");
    }
}
```

### ❌ 잘못된 방법
```java
@Service
@RequiredArgsConstructor
public class MyService {
    // ❌ Credentials (복수형) - 존재하지 않음
    private final OAuth2Property.Credentials credentials;
    
    // ❌ 직접 접근 불가
    credentials.getFile()
    credentials.getMessage()
}
```

---

## ✅ 수정 완료된 파일

1. **NoticeMailService.java** ✅
2. **NoticeAttachmentService.java** ✅
3. **OutlookCalendarService.java** ✅

모든 파일이 정상적으로 컴파일되며, OAuth2Property를 올바르게 사용합니다.

---

## 🚀 배포 시 주의사항

### application.yaml 설정 확인

```yaml
spring:
  security:
    oauth2:
      client:
        id: ${CLIENT_ID}
        secret: ${CLIENT_SECRET}
      provider:
        file:
          base-url: https://filesdev.koreazinc.co.kr
          token-url: https://auth-dev.koreazinc.co.kr/v2/oauth/token
          scope: api://8dc5950a-b206-4b65-897c-a04e8fcb193b/.default
        message:
          base-url: https://message-api-dev.koreazinc.co.kr
          token-url: https://auth-dev.koreazinc.co.kr/v2/oauth/token
          scope: api://69721da5-1b95-473f-86fe-432c81850063/.default
        microsoft:
          base-url: https://login.microsoftonline.com
          token-url: https://login.microsoftonline.com/${tenant.id}/oauth2/v2.0/token
          scope: https://graph.microsoft.com/.default
```

---

## 💬 참고

spring-core의 OAuth2Property는 여러 OAuth2 Provider를 관리하기 위한 구조이며, 
각 서비스는 필요한 Provider의 Credential을 `getCredential(String key)` 메서드로 가져와 사용합니다.

이 방식은 다양한 외부 API (File API, Message API, Graph API 등)를 
단일 OAuth2 설정으로 통합 관리할 수 있게 해줍니다.
