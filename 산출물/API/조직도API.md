# 🚀 NoticeGate API 스펙 (v1.4)

## 📋 마스터 데이터 조회 API

### 1. 서비스 목록 조회
```
GET /api/services
```

**Response:**
```json
{
  "data": [
    {
      "serviceId": 1,
      "serviceCode": "ERP",
      "serviceName": "고려아연 ERP",
      "serviceCategory": "업무시스템",
      "contactInfo": "02-1234-5678"
    },
    {
      "serviceId": 2,
      "serviceCode": "GROUPWARE",
      "serviceName": "KZ 이음",
      "serviceCategory": "업무시스템",
      "contactInfo": "02-1234-5679"
    }
  ]
}
```

---

### 2. 법인 목록 조회
```
GET /api/corporations
```

**Query Parameters:**
- `includeInactive` (optional): 비활성 법인 포함 여부 (default: false)

**Response:**
```json
{
  "data": [
    {
      "corpId": 1,
      "corpCode": "KZ",
      "corpName": "고려아연",
      "parentCorpId": null,
      "businessNumber": "123-45-67890"
    },
    {
      "corpId": 2,
      "corpCode": "KZGT",
      "corpName": "케이지그린텍",
      "parentCorpId": 1,
      "businessNumber": "123-45-67891"
    }
  ]
}
```

---

### 3. 조직(부서) 목록 조회
```
GET /api/organizations
```

**Query Parameters:**
- `corpId` (optional): 법인 ID로 필터링
- `parentOrgUnitId` (optional): 상위 조직 ID로 필터링 (하위 조직만)

**Response:**
```json
{
  "data": [
    {
      "orgUnitId": 1,
      "orgUnitCode": "ITH3",
      "orgUnitName": "서린정보기술 ITH3팀",
      "corpId": 1,
      "corpName": "고려아연",
      "parentOrgUnitId": null,
      "orgLevel": 2
    },
    {
      "orgUnitId": 4,
      "orgUnitCode": "PURCHASE01",
      "orgUnitName": "구매전략 1팀",
      "corpId": 1,
      "corpName": "고려아연",
      "parentOrgUnitId": null,
      "orgLevel": 2
    }
  ]
}
```

---

### 4. 사용자 목록 조회
```
GET /api/users
```

**Query Parameters:**
- `orgUnitId` (optional): 부서 ID로 필터링
- `corpId` (optional): 법인 ID로 필터링
- `search` (optional): 이름/이메일 검색

**Response:**
```json
{
  "data": [
    {
      "userId": "park001",
      "userKoNm": "박경민",
      "userEnNm": "Park Kyung-min",
      "email": "park.km@company.com",
      "orgUnitId": 3,
      "orgUnitName": "서린정보기술 ITH3팀",
      "corpId": 1,
      "corpName": "고려아연",
      "position": "수석"
    }
  ]
}
```

---

### 5. 현재 사용자 정보 조회
```
GET /api/users/me
```

**Response:**
```json
{
  "userId": "park001",
  "userKoNm": "박경민",
  "userEnNm": "Park Kyung-min",
  "email": "park.km@company.com",
  "orgUnitId": 3,
  "orgUnitName": "서린정보기술 ITH3팀",
  "corpId": 1,
  "corpName": "고려아연",
  "position": "수석",
  "lastLoginAt": "2026-01-13T09:30:00Z"
}
```

---

## 📝 공지 관리 API

### 6. 공지 등록
```
POST /api/notices
```

**Request Body:**
```json
{
  "title": "고려아연 ERP 시스템 점검 안내",
  "content": "고려아연 ERP 시스템 점검으로 인하여...",
  "noticeLevel": "L2",
  "affectedServiceId": 1,
  "publishStartAt": "2025-10-22T08:00:00Z",
  "publishEndAt": "2025-10-22T19:00:00Z",
  "isMaintenance": true,
  "mailSubject": "[점검] 고려아연 ERP 시스템 점검 안내",
  "targets": [
    {
      "targetType": "CORP",
      "targetKey": "KZ",
      "targetName": "고려아연"
    },
    {
      "targetType": "ORG_UNIT",
      "targetKey": "KZ_HQ",
      "targetName": "고려아연_본사"
    }
  ],
  "tags": ["인프라 작업", "ERP"],
  "sendPlan": {
    "sendMode": "SCHEDULED",
    "scheduledSendAt": "2025-10-22T08:30:00Z",
    "allowBundle": true
  },
  "outlookCalendar": {
    "register": true,
    "eventDate": "2025-10-22T17:30:00Z"
  }
}
```

**Response:**
```json
{
  "noticeId": 123,
  "status": "DRAFT",
  "createdAt": "2026-01-13T10:00:00Z"
}
```

---

### 7. 공지 목록 조회
```
GET /api/notices
```

**Query Parameters:**
- `status` (optional): 상태 필터 (DRAFT, PENDING, APPROVED, SENT, FAILED, COMPLETED)
- `level` (optional): 중요도 필터 (L1, L2, L3)
- `serviceId` (optional): 서비스 ID 필터
- `startDate` (optional): 게시 시작일 범위
- `endDate` (optional): 게시 종료일 범위
- `page` (default: 1)
- `size` (default: 20)

**Response:**
```json
{
  "data": [
    {
      "noticeId": 123,
      "title": "고려아연 ERP 시스템 점검 안내",
      "noticeLevel": "L2",
      "noticeStatus": "APPROVED",
      "affectedService": {
        "serviceId": 1,
        "serviceName": "고려아연 ERP"
      },
      "senderOrgUnitName": "서린정보기술 ITH3팀",
      "publishStartAt": "2025-10-22T08:00:00Z",
      "publishEndAt": "2025-10-22T19:00:00Z",
      "isMaintenance": true,
      "isCompleted": false,
      "createdAt": "2026-01-13T10:00:00Z",
      "createdBy": "park001"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 100,
    "itemsPerPage": 20
  }
}
```

---

### 8. 공지 상세 조회
```
GET /api/notices/{noticeId}
```

**Response:**
```json
{
  "noticeId": 123,
  "title": "고려아연 ERP 시스템 점검 안내",
  "content": "고려아연 ERP 시스템 점검으로 인하여...",
  "noticeLevel": "L2",
  "noticeStatus": "APPROVED",
  "affectedService": {
    "serviceId": 1,
    "serviceName": "고려아연 ERP"
  },
  "senderOrgUnitName": "서린정보기술 ITH3팀",
  "publishStartAt": "2025-10-22T08:00:00Z",
  "publishEndAt": "2025-10-22T19:00:00Z",
  "isMaintenance": true,
  "isCompleted": false,
  "mailSubject": "[점검] 고려아연 ERP 시스템 점검 안내",
  "targets": [
    {
      "targetType": "CORP",
      "targetKey": "KZ",
      "targetName": "고려아연"
    }
  ],
  "tags": ["인프라 작업", "ERP"],
  "approval": {
    "approvalStatus": "APPROVED",
    "approverName": "김부장",
    "decidedAt": "2026-01-13T11:00:00Z"
  },
  "sendPlan": {
    "sendMode": "SCHEDULED",
    "scheduledSendAt": "2025-10-22T08:30:00Z",
    "allowBundle": true
  },
  "createdAt": "2026-01-13T10:00:00Z",
  "createdBy": "park001",
  "updatedAt": "2026-01-13T11:00:00Z",
  "updatedBy": "park001"
}
```

---

### 9. 공지 수정
```
PUT /api/notices/{noticeId}
```

**Request Body:** (등록과 동일)

---

### 10. 공지 삭제
```
DELETE /api/notices/{noticeId}
```

---

### 11. 공지 승인 요청
```
POST /api/notices/{noticeId}/approval
```

**Response:**
```json
{
  "approvalId": 456,
  "approvalStatus": "PENDING",
  "requestedAt": "2026-01-13T12:00:00Z"
}
```

---

### 12. 공지 승인/반려
```
POST /api/approvals/{approvalId}/decide
```

**Request Body:**
```json
{
  "decision": "APPROVED",  // or "REJECTED"
  "rejectReason": "내용 수정 필요"  // REJECTED인 경우만
}
```

---

## 📊 Dashboard API

### 13. Dashboard 통계
```
GET /api/dashboard/stats
```

**Response:**
```json
{
  "pendingApprovalCount": 3,
  "scheduledSendCount": 2,
  "failedSendCount": 0,
  "completedSendCount": 5,
  "noticeByType": [
    {
      "noticeType": "시스템 정상화 안내",
      "count": 15,
      "percentage": 42.9
    },
    {
      "noticeType": "시스템 점검 안내",
      "count": 8,
      "percentage": 28.6
    }
  ],
  "noticeByDept": [
    {
      "orgUnitName": "구매전략 1팀",
      "receiveCount": 45
    },
    {
      "orgUnitName": "구매전략 2팀",
      "receiveCount": 28
    }
  ]
}
```

---

### 14. 캘린더 데이터 조회
```
GET /api/calendar/events
```

**Query Parameters:**
- `year` (required): 년도
- `month` (required): 월 (1-12)

**Response:**
```json
{
  "events": [
    {
      "noticeId": 123,
      "title": "고려아연 ERP 시스템 점검",
      "noticeLevel": "L2",
      "publishStartAt": "2025-10-22T08:00:00Z",
      "publishEndAt": "2025-10-22T19:00:00Z",
      "senderOrgUnitName": "서린정보기술 ITH3팀",
      "isMaintenance": true,
      "isCompleted": false
    }
  ]
}
```

---

## 🔐 인증 관련 API

### 15. SSO 로그인 콜백
```
POST /api/auth/sso-callback
```

**Request Body:**
```json
{
  "code": "authorization_code",
  "state": "random_state"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "userId": "park001",
    "userKoNm": "박경민",
    "email": "park.km@company.com",
    "orgUnitName": "서린정보기술 ITH3팀"
  }
}
```

---

## 🔄 배치 작업 API (Internal)

### 16. 조직도 동기화
```
POST /api/batch/sync-organization
```

**Request Body:**
```json
{
  "source": "HR_SYSTEM",
  "fullSync": true
}
```

---

### 17. 사용자 정보 동기화
```
POST /api/batch/sync-users
```

**Request Body:**
```json
{
  "source": "SSO_SYSTEM",
  "fullSync": true
}
```

---

## 📝 에러 응답

모든 API는 다음 형식으로 에러를 반환합니다:

```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "필수 필드가 누락되었습니다.",
    "details": {
      "field": "affectedServiceId",
      "reason": "required"
    }
  }
}
```

**에러 코드:**
- `INVALID_REQUEST` - 잘못된 요청
- `UNAUTHORIZED` - 인증 필요
- `FORBIDDEN` - 권한 없음
- `NOT_FOUND` - 리소스 없음
- `CONFLICT` - 중복 데이터
- `INTERNAL_ERROR` - 서버 오류

---

## 🎯 프론트엔드 구현 예시

### React에서 서비스 목록 가져오기

```javascript
// NoticeRegistration.jsx
import { useState, useEffect } from 'react';

const NoticeRegistration = () => {
  const [services, setServices] = useState([]);
  const [corporations, setCorporations] = useState([]);
  const [organizations, setOrganizations] = useState([]);

  useEffect(() => {
    // 서비스 목록 조회
    fetch('/api/services')
      .then(res => res.json())
      .then(data => setServices(data.data));

    // 법인 목록 조회
    fetch('/api/corporations')
      .then(res => res.json())
      .then(data => setCorporations(data.data));
  }, []);

  const handleCorpChange = (corpId) => {
    // 법인 선택 시 해당 법인의 부서 목록 조회
    fetch(`/api/organizations?corpId=${corpId}`)
      .then(res => res.json())
      .then(data => setOrganizations(data.data));
  };

  return (
    <form>
      {/* 영향받는 서비스 */}
      <select>
        {services.map(s => (
          <option key={s.serviceId} value={s.serviceId}>
            {s.serviceName}
          </option>
        ))}
      </select>

      {/* 수신 법인 */}
      <select onChange={(e) => handleCorpChange(e.target.value)}>
        {corporations.map(c => (
          <option key={c.corpId} value={c.corpId}>
            {c.corpName}
          </option>
        ))}
      </select>

      {/* 수신 부서 */}
      <select>
        {organizations.map(o => (
          <option key={o.orgUnitId} value={o.orgUnitId}>
            {o.orgUnitName}
          </option>
        ))}
      </select>
    </form>
  );
};
```

---

## 🚀 다음 단계

1. **Spring Boot Controller 구현**
2. **Service Layer 구현**
3. **Repository (JPA) 구현**
4. **DTO 매핑**
5. **예외 처리**
6. **API 테스트**

이 API 스펙을 기반으로 백엔드 구현을 진행하시면 됩니다! 😊