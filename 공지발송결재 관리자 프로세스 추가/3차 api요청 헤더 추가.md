# 공지 발송 결재 - 관리자 권한 관리 기능 (v3 최종)

## 📋 업데이트 내역

### ✅ **v3 추가 개발 완료**
1. **HTTP 헤더 자동 추가** (`apiClient.js`)
2. **실시간 권한 갱신** (`AdminContext`)
3. **모든 컴포넌트 Context 연동**

---

## 🎯 **주요 기능**

### 1️⃣ **HTTP 헤더 자동 추가**
모든 API 요청에 `X-User-Id`, `X-User-Name` 헤더 자동 포함

**적용 방법:**
```javascript
// apiClient.js의 getHeaders() 메서드에서 자동 처리
const userData = JSON.parse(sessionStorage.getItem('userData'));
headers['X-User-Id'] = userData.userId;
headers['X-User-Name'] = userData.userNm;
```

### 2️⃣ **실시간 권한 갱신**
위임 생성/삭제 후 **헤더 배지 즉시 업데이트**

**동작 방식:**
1. 위임 생성 → `refreshPermission()` 호출
2. AdminContext에서 권한 재확인
3. AppHeader 배지 자동 업데이트

### 3️⃣ **AdminContext 전역 상태 관리**
모든 컴포넌트에서 `useAdmin()` 훅으로 권한 상태 공유

**제공 기능:**
- `isAdmin`: 관리자 여부
- `isDelegatedAdmin`: 대리 관리자 여부
- `userInfo`: 사용자 정보
- `refreshPermission()`: 권한 갱신 함수

---

## 🗂️ **파일 구조 (v3)**

### 📁 프론트엔드
```
frontend/
├── apiClient.js                      ✅ HTTP 헤더 자동 추가
├── AdminContext.jsx                  ✅ 전역 권한 상태 관리
├── AdminDelegationModal.jsx          ✅ 권한 갱신 호출
├── AppHeader.jsx                     ✅ Context 사용
├── NoticeApproval.jsx                ✅ Context 사용
├── App.jsx                           ✅ AdminProvider 추가
├── AdminDelegationModal.css
├── NoticeApproval_styles.css
└── AppHeader_styles.css
```

---

## 🚀 **설치 가이드 (v3 최종)**

### 1️⃣ **프론트엔드 파일 배치**

#### **utils/**
```bash
temp/react-app/src/utils/
└── apiClient.js  ✅ 교체 (헤더 자동 추가)
```

#### **contexts/** (신규 폴더)
```bash
mkdir temp/react-app/src/contexts
temp/react-app/src/contexts/
└── AdminContext.jsx  ✅ 새 파일
```

#### **components/**
```bash
temp/react-app/src/components/
├── AdminDelegationModal.jsx  ✅ 교체 (권한 갱신 추가)
├── AppHeader.jsx             ✅ 교체 (Context 사용)
├── AdminDelegationModal.css  (기존 유지)
└── AppHeader.css             ✅ 끝에 스타일 추가
```

#### **pages/**
```bash
temp/react-app/src/pages/
├── NoticeApproval.jsx  ✅ 교체 (Context 사용)
└── NoticeApproval.css  ✅ 끝에 스타일 추가
```

#### **루트 App.jsx**
```bash
temp/react-app/src/
└── App.jsx  ✅ 교체 (AdminProvider 추가)
```

---

## 📝 **핵심 코드**

### 1️⃣ **apiClient.js - 헤더 자동 추가**
```javascript
getHeaders(customHeaders = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  // Authorization 토큰
  const token = getAccessToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // ✅ X-User-Id, X-User-Name 자동 추가
  try {
    const userData = JSON.parse(
      sessionStorage.getItem('userData') || 
      sessionStorage.getItem('user_me')
    );
    
    if (userData) {
      if (userData.userId) {
        headers['X-User-Id'] = userData.userId;
      }
      if (userData.userNm || userData.userKoNm) {
        headers['X-User-Name'] = userData.userNm || userData.userKoNm;
      }
    }
  } catch (error) {
    console.warn('사용자 정보 헤더 추가 실패:', error);
  }

  return headers;
}
```

### 2️⃣ **AdminContext - 전역 상태 관리**
```javascript
export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDelegatedAdmin, setIsDelegatedAdmin] = useState(false);
  
  const refreshPermission = async () => {
    console.log('🔄 권한 갱신...');
    await checkAdminPermission();
  };
  
  return (
    <AdminContext.Provider value={{
      isAdmin,
      isDelegatedAdmin,
      refreshPermission
    }}>
      {children}
    </AdminContext.Provider>
  );
};
```

### 3️⃣ **AdminDelegationModal - 권한 갱신**
```javascript
import { useAdmin } from '../contexts/AdminContext';

const AdminDelegationModal = ({ isOpen, onClose }) => {
  const { refreshPermission } = useAdmin();
  
  const handleSubmit = async (e) => {
    await adminDelegationApi.createDelegation(formData);
    
    // ✅ 권한 갱신
    await refreshPermission();
    
    alert('위임 생성 완료');
  };
  
  return (/* ... */);
};
```

### 4️⃣ **App.jsx - Provider 추가**
```javascript
import { AdminProvider } from "./contexts/AdminContext";

export default function App() {
  return (
    <Routes>
      <Route element={<RequireAuth />}>
        <Route element={
          <AdminProvider>
            <AppLayout />
          </AdminProvider>
        }>
          {/* 페이지들 */}
        </Route>
      </Route>
    </Routes>
  );
}
```

---

## 🧪 **테스트 시나리오**

### 시나리오 1: 헤더 자동 추가 확인
1. 개발자 도구 Network 탭 열기
2. 공지 승인 API 호출
3. ✅ Request Headers에 `X-User-Id`, `X-User-Name` 자동 포함 확인

### 시나리오 2: 실시간 권한 갱신
1. HR150138 권한자로 로그인
2. 헤더에 "관리자" 배지 표시
3. "관리자 위임" 클릭 → 대리자 선택 → 생성
4. ✅ 헤더 배지 변경 없음 (원래 관리자 유지)
5. 일반 사용자로 로그인
6. 헤더에 배지 없음
7. 위 HR150138가 현재 일반 사용자에게 위임 생성
8. ✅ 헤더에 "대리" 배지 **즉시 표시**
9. 위임 비활성화
10. ✅ 헤더 배지 **즉시 사라짐**

### 시나리오 3: Context 공유 확인
1. AppHeader에서 `isAdmin` 확인
2. NoticeApproval에서 동일한 `isAdmin` 사용
3. ✅ 동일한 상태 공유

---

## 📊 **동작 흐름도**

```
┌─────────────────────────────────────────────────────────┐
│                    App.jsx (시작)                        │
│                      ↓                                    │
│              AdminProvider (전역 상태)                    │
│                      ↓                                    │
│    ┌──────────────────────────────────────────────┐     │
│    │  AppHeader          NoticeApproval           │     │
│    │  (isAdmin 사용)     (isAdmin 사용)           │     │
│    └──────────────────────────────────────────────┘     │
│                      ↓                                    │
│            AdminDelegationModal                          │
│         (refreshPermission 호출)                         │
│                      ↓                                    │
│             AdminContext.refreshPermission()             │
│                      ↓                                    │
│          권한 재확인 → 상태 업데이트                      │
│                      ↓                                    │
│      AppHeader 배지 자동 업데이트 ✨                     │
└─────────────────────────────────────────────────────────┘
```

---

## ⚡ **개선 사항 요약**

| 구분 | 변경 전 | 변경 후 |
|------|---------|---------|
| **HTTP 헤더** | 수동 추가 필요 | ✅ 자동 추가 |
| **권한 갱신** | 새로고침 필요 | ✅ 실시간 갱신 |
| **상태 관리** | 각 컴포넌트 개별 | ✅ Context 공유 |
| **배지 업데이트** | 새로고침 필요 | ✅ 즉시 반영 |

---

## 🎯 **다음 단계 (선택사항)**

1. **SSO API 연동** - AdminUsersController 샘플 데이터 대체
2. **로딩 상태** - Context에 loading 표시
3. **에러 핸들링** - 권한 체크 실패 시 사용자 안내
4. **권한 만료 알림** - 위임 종료 1일 전 알림

---

## 🎉 **완료!**

### 빠른 적용 체크리스트:
- [ ] ✅ apiClient.js 교체 (헤더 자동 추가)
- [ ] ✅ contexts/AdminContext.jsx 생성
- [ ] ✅ AdminDelegationModal.jsx 교체
- [ ] ✅ AppHeader.jsx 교체
- [ ] ✅ NoticeApproval.jsx 교체
- [ ] ✅ App.jsx 교체 (Provider 추가)
- [ ] ✅ CSS 파일 스타일 추가
- [ ] ✅ 빌드 & 재시작
- [ ] ✅ 테스트 (위임 생성 후 배지 확인)

**모든 추가 개발이 완료되었습니다!** 🚀

이제 다음 기능이 모두 작동합니다:
1. ✅ HTTP 헤더 자동 추가
2. ✅ 실시간 권한 갱신
3. ✅ 전역 상태 관리
4. ✅ 위임 후 배지 즉시 업데이트

**문의사항이 있으시면 언제든지 말씀해주세요!**
