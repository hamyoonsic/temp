# Error response specification — spring-core

요약 ✅
- 목적: 내부 스택/민감정보를 프로덕션 응답에서 제거하고, 운영 추적을 위해 `errorId`를 도입한다. 개발환경에서만 `trace` 노출을 허용한다.
- 위치: `spring-core` 공통 에러 처리(서블릿 + 리액티브)

## 1. 핵심 원칙
- Production 응답에 스택트레이스(Trace) 절대 노출 금지.
- 모든 처리되지 않은 예외는 고유한 `errorId`(UUID)를 생성하여 응답과 로그에 남긴다.
- 요청-로그 연계를 위해 `correlationId`(클라이언트 전달 또는 생성)를 사용한다.
- 디버깅 목적의 `trace`는 오직 개발 전용 설정(`error.show-trace=true`) 또는 `showTrace` request-attribute/테스트에서만 허용.

## 2. 응답 스펙 (JSON)
- 공통 필드
  - `timestamp` (string, yyyy-MM-dd HH:mm:ss)
  - `status` (integer)
  - `path` (string)
  - `message` (string)
  - `errorId` (string, UUID) — **클라이언트와 운영팀이 참조하는 식별자**
  - `trace` (string) — dev-only

예시 (production)

```json
{
  "timestamp":"2026-02-04 12:34:56",
  "status":500,
  "path":"/api/v1/notes",
  "message":"Internal server error",
  "errorId":"a1b2c3d4-e5f6-7890"
}
```

예시 (dev / show-trace=true)

```json
{
  "timestamp":"2026-02-04 12:34:56",
  "status":500,
  "path":"/api/v1/notes",
  "message":"Validation failed",
  "errorId":"a1b2c3d4-e5f6-7890",
  "trace":"java.lang.RuntimeException: ..."
}
```

## 3. HTTP 상태 매핑(권장)
- 4xx: 클라이언트 에러 — 사용자 친화적 메시지
- 400 (Bad Request) — 검증 오류 (필요 시 validation 세부 항목은 별도 계약)
- 401/403 — 인증/권한 오류 (errorId 포함)
- 404 — Not found
- 5xx — 서버 오류 (errorId 필수)

## 4. 로그 규격(운영팀용)
- 로그는 반드시 `errorId`와 `correlationId` 포함
- logback(production, JSON) 권장 필드: `timestamp, level, service, logger, message, http.path, http.status, correlationId, errorId, stack`(dev-only)

샘플 패턴 (plain text)

```
%d{ISO8601} %-5level [%thread] %logger{36} - %msg%n%X{correlationId} %X{errorId}
```

샘플 JSON layout 키(예: Loki)
```
{ "ts": "@timestamp", "level": "level", "service":"app-api", "message":"msg", "http.path":"/v1/..", "http.status":500, "correlationId":"...", "errorId":"...", "stack":"..." }
```

## 5. 헤더 / 상관관계
- 권장 요청 헤더: `X-Correlation-Id` (있으면 재사용, 없으면 서버 생성)
- 클라이언트 가이드: 에러 발생 시 운영팀에 `errorId` 전달

## 6. 개발자 가이드(코드 레벨)
- `ErrorResponse.of(...)` 사용해 응답 생성
- `GlobalExceptionFilter` / `GlobalExceptionAdvice`에서 `errorId` 생성 → `MDC.put("errorId", ...)` 및 request-attribute에 저장
- `error.show-trace` 프로퍼티로 trace 노출 제어

### 단위·통합 테스트 포인트
- 응답에 `errorId`가 항상 존재하는지
- 기본(production)에서 `trace`는 null
- `showTrace=true` 또는 `showTrace` attribute일 때 `trace` 포함
- `X-Correlation-Id`가 있을 때 로그/응답에 동일한 값 반영

## 7. 모니터링·알림(권장 룰)
- Alert P0 — 서비스 5xx 비율 급증
  - 예: LogQL: count_over_time({app="app-api", level="ERROR"} |= "status=5" [5m]) > threshold
- Alert P1 — 동일 `errorId`가 N회 이상 발생(반복 오류)
  - 예: sum by (errorId) (count_over_time({app="app-api"} |= "errorId=" [5m])) > 10
- Alert P2 — 외부 의존성 오류 비율 상승

간단한 Runbook 요약
1. Alert 수신 → `errorId` 확인
2. Grafana/Loki에서 `errorId`로 전체 로그 조회
3. 관련 컨텍스트(유저, endpoint, payload 샘플) 수집 → hotfix 또는 롤백

## 8. 배포 체크리스트 (권장)
- [ ] Unit + Integration tests 통과
- [ ] Dev에서 `error.show-trace=false`로 동작 검증
- [ ] logback 패턴(로그 수집) 동기화
- [ ] Canary → 모니터(48h) → 전체 롤아웃

## 9. 호환성 / 마이그레이션
- 기존 일부 클라이언트가 `trace`에 의존하면 호환성 문서화 필요(버전 표기)
- `errorId`는 backward-compatible: 기존 클라이언트는 무시 가능

## 10. FAQ (빠른질문)
Q: 클라이언트에 더 많은 디버그 정보 제공해야 하나요?
A: No — 운영팀에 `errorId` 전달하면 서버 로그로 모든 정보를 추적할 수 있음.

## 11. 다음 권장 작업 (빠른 우선순위)
1. logback prod 패턴에 `%X{correlationId}`, `%X{errorId}` 추가 (JSON 레이아웃) ✅
2. Loki 대시보드 + 알림 룰 추가 (템플릿 제공) ✅
3. OpenAPI에 에러 스펙 추가(계약 테스트) ✅

---
문서를 더 축약해서 API 사용자용(한 페이지) 또는 SRE용(운영 매뉴얼 포함)으로 분리해 드릴까요?"