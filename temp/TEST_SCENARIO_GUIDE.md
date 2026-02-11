# 공지사항 관리 시스템 - 테스트 시나리오 가이드

## 📋 문서 개요

이 문서는 공지사항 관리 시스템의 **완전한 테스트 시나리오**와 **상세 흐름도**를 제공합니다.

### 포함 내용

1. **TEST_SCENARIOS.md** (이전 문서)
   - 전체 시스템 개요
   - 17개의 구체적인 테스트 시나리오 (Happy Path, 예외, 통합, 성능, 보안)
   - 데이터 검증 규칙
   - 테스트 환경 및 실행 방법

2. **SYSTEM_FLOW_DETAILED.md** (본 문서)
   - 전체 시스템 아키텍처 다이어그램
   - 6가지 주요 프로세스의 상세 흐름도
   - 데이터 플로우 및 엔티티 관계도

---

## 🎯 시스템 목적

### 주요 목표
```
무분별한 공지 메일 발송 방지 → 승인 기반 체계 수립
                                    ↓
                          예약/즉시 발송 선택
                                    ↓
                          Outlook 캘린더 자동 연동
                                    ↓
                          발송 결과 추적 및 분석
```

### 핵심 정책 (DPR)

| 정책 | 설명 | 테스트 |
|------|------|--------|
| DPR-01 | 승인 전 발송 불가 | TC-005 |
| DPR-02 | 반려된 공지는 발송 불가 | TC-004 |
| DPR-03 | 종료된 공지는 수정 불가 | TC-008 |
| DPR-04 | 예약시각은 현재 이후만 가능 | TC-004 |
| DPR-05 | 동일 시각 공지는 묶음 발송 | TC-003 |
| DPR-06 | 발송 완료 후 변경 불가 | TC-009 |
| DPR-07 | 캘린더 링크 누락 시 완료 불가 | TC-007 |
| DPR-08 | 승인 이력은 append-only | TC-010 |

---

## 🏗️ 시스템 아키텍처

### 기술 스택

```
Frontend          Backend              Database        External
━━━━━━━━         ━━━━━━━━━━           ━━━━━━━━        ━━━━━━━━
React.js    →   Spring Boot       →   MySQL      →    Outlook API
(Port: 3000)    (Port: 8001)       (3306)             SMTP Server
                Spring Cloud                          ASKME API
                Gateway (11000)
```

### 마이크로서비스 구성

| 서비스 | 포트 | 역할 |
|--------|------|------|
| App-API | 8001 | 공지 등록/승인/발송 API |
| Spring-Core | - | 공통 유틸리티 (ErrorResponse 등) |
| Data-Temp | - | 공지 시스템 데이터 계층 |
| Cloud Gateway | 11000 | API 라우팅, 인증 검증 |
| Cloud Discovery | - | 서비스 레지스트리 |
| Cloud Actuator | - | 헬스 체크, 모니터링 |

---

## 📊 주요 프로세스

### 1️⃣ 공지 등록 (Notion Registration)

**핵심 단계:**
1. 작성자가 공지 정보 입력 (제목, 내용, 대상, 해시태그)
2. 유효성 검증 (필수값, 길이, 형식)
3. Entity 생성 및 DB 저장
4. 수신자 정보 저장
5. 승인자에게 알림 발송

**관련 테스트:** TC-001 (Happy Path)

**상태 흐름:**
```
DRAFT → PENDING → (대기) → APPROVED/REJECTED
```

---

### 2️⃣ 승인 관리 (Approval Management)

**핵심 단계:**
1. 승인 관리자가 공지 검토
2. 승인 또는 반려 결정
3. 결정 이력 저장 (append-only)
4. 공지 상태 업데이트
5. 결과 알림 발송

**관련 테스트:** TC-002 (반려 후 재승인)

**상태 흐름:**
```
PENDING → APPROVED → (발송 가능)
  ↓
REJECTED → (재수정 필요)
```

---

### 3️⃣ 예약 발송 (Scheduled Sending)

**핵심 단계:**
1. 작성자가 발송 시각 설정
2. 유효성 검증 (현재 이후, 승인 여부 등)
3. SEND_SCHEDULE 테이블에 저장
4. 스케줄러가 주기적으로 확인
5. 시각 도래 시 발송 프로세스 시작

**관련 테스트:** TC-001, TC-003, TC-004, TC-006

**상태 흐름:**
```
SCHEDULED → SENT → COMPLETED
         → FAILED → (재시도)
```

---

### 4️⃣ 메일 발송 (Mail Sending)

**핵심 단계:**
1. 공지 및 수신자 정보 조회
2. 이메일 컨텐츠 생성
3. SMTP 서버 연결
4. 각 수신자에게 발송
5. 결과 기록 (SEND_RESULT)

**관련 테스트:** TC-001, TC-006, TC-013

**성능 목표:**
- 응답 시간 < 1초
- 성공률 > 99%
- 묶음 발송 효율화

---

### 5️⃣ 캘린더 연동 (Calendar Sync)

**핵심 단계:**
1. 메일 발송 완료 확인
2. 캘린더 연동 대상 확인 (notice_type)
3. Outlook Graph API 호출
4. 캘린더 이벤트 생성
5. 캘린더 링크 저장

**관련 테스트:** TC-001, TC-007, TC-013

**연동 대상:**
- ✅ "공식공지", "중요공지" → 캘린더 등록
- ❌ "일반공지" → 캘린더 미등록

---

### 6️⃣ 에러 처리 (Error Handling)

**핵심 단계:**
1. 예외 발생
2. Global Exception Handler 포착
3. ErrorResponse 생성 (errorId 포함)
4. 로깅
5. HTTP 응답 반환

**관련 테스트:** TC-004~TC-010, TC-012

**에러 응답 예시:**
```json
{
  "timestamp": "2026-02-05 10:30:45",
  "status": 400,
  "error": "Bad Request",
  "message": "유효하지 않은 요청입니다",
  "path": "/api/notices",
  "errorId": "f7a2c5d3-8f1d-4c5b-a9e2-1b3d5f7c9e1a",
  "trace": null
}
```

---

## 🧪 테스트 시나리오 요약

### Happy Path (정상 흐름)

| TC# | 시나리오 | 단계 | 예상 결과 |
|-----|---------|------|---------|
| TC-001 | 공지 등록부터 발송까지 | 등록→승인→예약→발송→캘린더 | ✅ COMPLETED |
| TC-002 | 반려 후 재승인 | 등록→반려→수정→재승인→발송 | ✅ APPROVED |
| TC-003 | 묶음 발송 | 동일시각 3개 공지 | ✅ 3개 동시 발송 |

### Exception Handling (예외 처리)

| TC# | 시나리오 | 원인 | 예상 결과 |
|-----|---------|------|---------|
| TC-004 | 과거 시각 예약 | DPR-04 위반 | ❌ 400 Bad Request |
| TC-005 | 승인 전 발송 | DPR-01 위반 | ❌ 403 Forbidden |
| TC-006 | 메일 발송 실패 | SMTP 오류 | ❌ 재시도 로직 |
| TC-007 | 캘린더 연동 실패 | API 오류 | ⚠️ 메일은 발송됨 |
| TC-008 | 종료 공지 수정 | DPR-03 위반 | ❌ 400 Bad Request |
| TC-009 | 발송 후 변경 | DPR-06 위반 | ❌ 400 Bad Request |
| TC-010 | 승인 이력 변경 | DPR-08 위반 | ❌ DB 제약 조건 위반 |

### Integration Tests (통합 테스트)

| TC# | 시나리오 | 검증 항목 |
|-----|---------|---------|
| TC-011 | 다양한 수신 대상 | 법인/부서/사용자/서비스 조합 |
| TC-012 | 에러 응답 포맷 | errorId, status, message 일관성 |
| TC-013 | 대량 공지 발송 | 1000개 공지, 100명/수신자 |
| TC-014 | 동시 승인 요청 | 동시성 제어, 데이터 무결성 |

### Security Tests (보안 테스트)

| TC# | 시나리오 | 검증 항목 |
|-----|---------|---------|
| TC-015 | 권한 검증 | 403 Forbidden for unauthorized |
| TC-016 | SQL Injection | PreparedStatement 사용 |
| TC-017 | XSS 방지 | HTML 특수문자 이스케이프 |

---

## 🚀 테스트 실행 방법

### 1. 전체 테스트 실행
```bash
# 프로젝트 루트에서
./gradlew test

# 결과: build/reports/tests/test/index.html
```

### 2. 특정 테스트 클래스 실행
```bash
./gradlew test --tests ErrorResponseTest

./gradlew test --tests "*IntegrationTest"
```

### 3. 커버리지 리포트 생성
```bash
./gradlew test jacocoTestReport

# 결과: build/reports/jacoco/test/html/index.html
```

### 4. 테스트 필터링
```bash
# Happy Path만
./gradlew test --tests "*Test" -k "happy"

# 예외 처리만
./gradlew test --tests "*Test" -k "exception"
```

---

## 📈 테스트 커버리지 목표

| 계층 | 목표 | 현황 |
|------|------|------|
| Controller | 90% | - |
| Service | 95% | - |
| Repository | 85% | - |
| Entity | 80% | - |
| **전체** | **> 85%** | - |

---

## 📝 테스트 데이터 준비

### 초기 데이터셋 (Seed Data)

```sql
-- 공지 유형
INSERT INTO NOTICE_TYPE (id, name, description) VALUES
  ('NTY-01', '서비스공지', '일반 서비스 관련 공지'),
  ('NTY-02', '공식공지', '회사 공식 공지 (캘린더 등록)'),
  ('NTY-03', '중요공지', '긴급/중요 공지 (캘린더 등록)');

-- 부서
INSERT INTO DEPARTMENT (id, name, parent_id) VALUES
  ('DEPT-001', 'IT팀', NULL),
  ('DEPT-002', '운영팀', NULL),
  ('DEPT-003', '개발팀', 'DEPT-001');

-- 사용자
INSERT INTO USER (id, name, email, department_id) VALUES
  ('USER-001', '김철수', 'kim@corp.com', 'DEPT-001'),
  ('USER-002', '이영희', 'lee@corp.com', 'DEPT-002'),
  ('USER-003', '박관리', 'park@corp.com', 'DEPT-001');
```

### 테스트용 Request 예시

```json
{
  "notice_type_id": "NTY-01",
  "title": "[공지] 새로운 시스템 출시",
  "content": "2026년 2월 20일 신규 시스템이 출시됩니다...",
  "sender_dept_id": "DEPT-001",
  "recipients": [
    {
      "type": "corporate",
      "recipient_id": "CORP-001"
    },
    {
      "type": "user",
      "recipient_id": "USER-002"
    }
  ],
  "hash_tags": ["#신규시스템", "#공지"],
  "send_schedule": {
    "scheduled_time": "2026-02-20T10:00:00",
    "calendar_enabled": true
  }
}
```

---

## 🔍 모니터링 & 디버깅

### 중요 로그 포인트

```
1. 공지 등록
   [INFO] Notice created - ID: {notice_id}, Status: DRAFT

2. 승인 이벤트
   [INFO] Notice approved - Approver: {approver}, Time: {timestamp}
   [WARN] Notice rejected - Reason: {reason}

3. 발송 프로세스
   [INFO] Schedule created - SendTime: {scheduled_time}
   [INFO] Email sent - Recipients: {count}, Success: {success_count}
   [ERROR] Email failed - Error: {error_message}

4. 캘린더 연동
   [INFO] Calendar event created - Link: {calendar_link}
   [ERROR] Calendar sync failed - Reason: {reason}
```

### 에러 ID 추적

```bash
# 에러 ID로 로그 검색
grep "errorId: f7a2c5d3-8f1d-4c5b-a9e2-1b3d5f7c9e1a" application.log

# Elasticsearch 쿼리
GET logs/_search
{
  "query": {
    "match": {
      "errorId": "f7a2c5d3-8f1d-4c5b-a9e2-1b3d5f7c9e1a"
    }
  }
}
```

---

## 🛠️ 트러블슈팅 가이드

### 메일 발송 실패

**증상:** `status: FAILED`, error_message 포함

**확인 사항:**
```
1. SMTP 설정
   - application-local.yaml의 mail 설정 확인
   - 호스트, 포트, 인증정보 검증

2. 네트워크
   - 방화벽 설정 확인
   - 메일 서버 접근성 확인

3. 이메일 주소
   - 수신자 이메일 형식 유효성
   - 이메일 주소 존재 여부

4. 인증
   - App-specific password 확인
   - OAuth2 토큰 유효성
```

### 캘린더 연동 실패

**증상:** `status: CALENDAR_FAILED`, calendar_link: NULL

**확인 사항:**
```
1. OAuth2 토큰
   - 토큰 유효 기간 확인
   - 토큰 갱신 로직 검증

2. Outlook API
   - API 키/시크릿 확인
   - 요청 URL 정확성
   - Scope 권한 확인

3. 사용자 설정
   - 사용자 메일박스 존재 확인
   - 캘린더 권한 확인
   - Outlook 계정 연동 상태
```

### 승인 알림 미수신

**증상:** 승인자가 알림 미수신

**확인 사항:**
```
1. 알림 발송 로직
   - NotificationService.sendApprovalNotification() 로그
   - 알림 DB 저장 확인

2. 메일 서버
   - 메일 전송 큐 확인
   - 메일 서버 로그 확인

3. 수신자 설정
   - 이메일 주소 정확성
   - 스팸 필터 설정
   - 수신자 권한 확인
```

---

## 📚 참고 자료

### 문서 맵

```
📄 TEST_SCENARIOS.md
   ├─ 1. 시스템 개요
   ├─ 2. 아키텍처 흐름
   ├─ 3. 핵심 비즈니스 프로세스
   ├─ 4. 데이터 모델
   ├─ 5. 테스트 시나리오 (17개)
   ├─ 6. 데이터 검증 규칙
   ├─ 7. 테스트 실행 환경
   ├─ 8. 모니터링 및 로깅
   ├─ 9. 배포 체크리스트
   └─ 10. 트러블슈팅 가이드

📄 SYSTEM_FLOW_DETAILED.md
   ├─ 1. 전체 시스템 아키텍처
   ├─ 2. 공지 등록 흐름도
   ├─ 3. 승인 관리 흐름도
   ├─ 4. 예약 발송 흐름도
   ├─ 5. 캘린더 연동 흐름도
   ├─ 6. 에러 처리 흐름도
   └─ 7. 데이터 플로우 (ER 다이어그램)

📄 TEST_SCENARIO_GUIDE.md (본 문서)
   ├─ 전체 개요
   ├─ 시스템 목적 및 정책
   ├─ 아키텍처 및 기술 스택
   ├─ 주요 프로세스 요약
   ├─ 테스트 시나리오 요약
   ├─ 테스트 실행 방법
   ├─ 테스트 데이터 준비
   └─ 모니터링 및 트러블슈팅
```

### API 문서

```
Swagger UI: http://localhost:11000/swagger-ui/index.html

주요 엔드포인트:
- POST /api/notices - 공지 등록
- GET /api/notices - 공지 조회
- PUT /api/approvals/{id}/approve - 승인
- PUT /api/approvals/{id}/reject - 반려
- POST /api/schedules - 발송 일정 등록
- GET /api/results - 발송 결과 조회
```

---

## ✅ 체크리스트

### 배포 전 점검

```
☐ 모든 단위 테스트 통과 (./gradlew test)
☐ 커버리지 > 85% (./gradlew jacocoTestReport)
☐ 통합 테스트 통과
☐ 성능 테스트 통과 (응답 시간 < 1초)
☐ 보안 검사 통과 (OWASP Top 10)
☐ 코드 리뷰 완료
☐ 데이터베이스 마이그레이션 스크립트 검증
☐ API 문서 최신화 (Swagger)
☐ 배포 환경 설정 확인
☐ 모니터링 시스템 활성화
☐ 알림 설정 확인 (에러 발생 시)
☐ 롤백 계획 수립
```

---

## 📞 연락처 & 지원

**문의 사항:**
- QA Lead: qa-team@corp.com
- Dev Lead: dev-team@corp.com
- DevOps: devops@corp.com

**문서 버전:**
- 작성일: 2026-02-05
- 최종 수정: 2026-02-05
- 버전: 1.0

---

**Happy Testing! 🚀**
