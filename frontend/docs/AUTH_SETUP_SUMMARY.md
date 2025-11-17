# ReactQuery + AuthGuard 설정 완료 ✅

## 구현된 내용

### 1. ReactQuery 설치 및 설정 완료

```bash
✅ @tanstack/react-query 설치됨
✅ @tanstack/react-query-devtools 설치됨
```

### 2. 생성된 파일

```
src/
├── providers/
│   └── ReactQueryProvider.tsx        ✅ ReactQuery Provider
├── hooks/
│   └── queries/
│       └── useUser.ts                ✅ 사용자 정보 Hook
├── components/
│   └── auth/
│       └── AuthGuard.tsx             ✅ 인증 Guard 컴포넌트
└── app/
    └── layout.tsx                    ✅ Provider 추가됨
```

### 3. 작성된 가이드 문서

```
docs/
├── guides/
│   ├── AUTH_GUARD_GUIDE.md           ✅ 완벽 가이드 (상세)
│   ├── QUICK_START_AUTH.md           ✅ 빠른 시작 (5분)
│   └── README.md                     ✅ 가이드 목록
└── AUTH_SETUP_SUMMARY.md             ✅ 이 파일
```

---

## 사용 방법

### 기본 사용 (3단계)

```tsx
// 1. 'use client' 추가
'use client'

// 2. AuthGuard import
import { AuthGuard } from '@/components/auth/AuthGuard'

// 3. 페이지 감싸기
export default function MyPage() {
  return (
    <AuthGuard>
      <div>내 페이지 내용</div>
    </AuthGuard>
  )
}
```

### 사용자 정보 가져오기

```tsx
import { useUserData } from '@/hooks/queries/useUser'

function MyComponent() {
  const user = useUserData()
  
  return <div>안녕하세요 {user?.name}님</div>
}
```

---

## 적용이 필요한 페이지

현재 Middleware에 설정된 보호 경로:

- ✅ `/mypage` - 마이페이지
- ✅ `/auction/create` - 경매 생성
- ✅ `/listing/edit` - 매물 수정

### 추가로 고려할 페이지

- `/auction/[id]` - 경매 상세 (로그인 필수인지 확인 필요)
- `/chat` - 채팅 (로그인 필수)
- `/verify` - 인증 페이지 (로그인 필수)

---

## 다음 단계

### API 연동 시

현재 `fetchCurrentUser()` 함수는 이미 구현되어 있습니다:

```typescript
// src/services/authService.ts
export async function fetchCurrentUser(): Promise<User | null> {
  try {
    const result = await authFetch.get<ApiResponse<User>>(API_ENDPOINTS.USER_INFO)
    return result.data
  } catch (error) {
    console.error('[authService] 사용자 정보 가져오기 실패:', error)
    return null
  }
}
```

**API 엔드포인트만 확정되면 바로 작동합니다!**

### AuthGuard 적용 시

1. 적용할 페이지 선택
2. `'use client'` 추가
3. `<AuthGuard>` 컴포넌트로 감싸기
4. 필요시 Middleware의 `protectedPaths`에 경로 추가

---

## 작동 원리

```
사용자가 /mypage 접근
    ↓
Middleware: 토큰 체크 (빠름)
    ↓ (토큰 있음)
AuthGuard: 사용자 정보 API 호출
    ↓
ReactQuery: 캐시 저장 (5분)
    ↓
Zustand: 자동 동기화
    ↓
페이지 렌더링
    ↓
다른 페이지 이동 (/auction)
    ↓
AuthGuard: 캐시에서 즉시 반환 (API 호출 X)
    ↓
페이지 렌더링 (빠름!)
```

---

## 참고 문서

- **빠르게 시작**: [QUICK_START_AUTH.md](./guides/QUICK_START_AUTH.md)
- **자세한 가이드**: [AUTH_GUARD_GUIDE.md](./guides/AUTH_GUARD_GUIDE.md)
- **전체 가이드 목록**: [guides/README.md](./guides/README.md)

---

## 개발 도구

### ReactQuery DevTools

개발 모드에서 실행하면 브라우저 우측 하단에 ReactQuery 아이콘이 표시됩니다.

```bash
npm run dev
```

**DevTools에서 확인 가능:**
- 캐시된 데이터
- API 요청 상태
- 리페칭 타이밍
- 캐시 무효화

---

## 체크리스트

프로젝트에 적용 시:

- [x] ReactQuery 설치
- [x] Provider 설정
- [x] useUser Hook 생성
- [x] AuthGuard 컴포넌트 생성
- [x] 가이드 문서 작성
- [ ] API 엔드포인트 확정
- [ ] 로그인 필수 페이지에 AuthGuard 적용
- [ ] Middleware protectedPaths 업데이트
- [ ] 테스트 (로그인/로그아웃 시나리오)

---

**준비 완료! 이제 필요한 페이지에 AuthGuard를 적용하기만 하면 됩니다.** 🚀

