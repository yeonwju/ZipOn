# AuthGuard 사용 가이드

## 📋 목차

1. [개요](#개요)
2. [아키텍처](#아키텍처)
3. [설치 및 설정](#설치-및-설정)
4. [기본 사용법](#기본-사용법)
5. [고급 사용법](#고급-사용법)
6. [실전 예제](#실전-예제)
7. [트러블슈팅](#트러블슈팅)

---

## 개요

AuthGuard는 **로그인이 필수인 페이지를 보호**하는 컴포넌트입니다.

### 주요 특징

- ✅ **효율적인 캐싱**: ReactQuery로 사용자 정보 한 번만 가져오기
- ✅ **2중 방어**: Middleware(토큰 체크) + AuthGuard(API 검증)
- ✅ **자동 동기화**: ReactQuery ↔ Zustand 자동 동기화
- ✅ **커스터마이징**: 로딩 UI, 리다이렉트 경로 자유롭게 설정

### 언제 사용하나요?

```
✅ 사용해야 하는 경우:
- /mypage - 마이페이지
- /auction - 경매 페이지
- /chat - 채팅 페이지
- /listings/new - 매물 등록
- /verify - 인증 페이지

❌ 사용하지 않는 경우:
- /home - 홈 (로그인 불필요)
- /listings - 매물 목록 (로그인 불필요)
- /live - 라이브 목록 (로그인 불필요)
```

---

## 아키텍처

### 전체 흐름도

```
사용자 접근
    ↓
┌─────────────────┐
│   Middleware    │  1차 방어: 토큰 유무 체크
│  (토큰 체크)     │  - 빠름 (~10ms)
└────────┬────────┘  - 페이지 로드 전 차단
         │
    토큰 있음
         ↓
┌─────────────────┐
│   AuthGuard     │  2차 방어: 사용자 정보 검증
│  (API 검증)      │  - API 호출
└────────┬────────┘  - 캐싱 및 Zustand 동기화
         │
    인증 성공
         ↓
┌─────────────────┐
│  페이지 렌더링   │
└─────────────────┘
```

### 데이터 흐름

```
useUser() 호출
    ↓
ReactQuery 캐시 확인
    ↓
┌─────────────────┐
│  캐시 있음?      │
└────┬────────┬───┘
     │        │
   YES       NO
     │        │
     │    API 호출
     │        ↓
     │   캐시 저장
     │        │
     └────┬───┘
          ↓
    Zustand 동기화
          ↓
    컴포넌트 렌더링
```

---

## 설치 및 설정

### 1. 패키지 설치 (이미 완료)

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

### 2. 파일 구조

```
src/
├── providers/
│   └── ReactQueryProvider.tsx     ✅ Provider 설정
├── hooks/
│   └── queries/
│       └── useUser.ts             ✅ 사용자 정보 Hook
├── components/
│   └── auth/
│       └── AuthGuard.tsx          ✅ AuthGuard 컴포넌트
├── store/
│   └── user.ts                    ✅ Zustand Store
├── services/
│   └── authService.ts             ✅ API 호출
└── middleware.ts                  ✅ Middleware
```

### 3. Provider 연결 (이미 완료)

`src/app/layout.tsx`에 Provider가 추가되어 있습니다:

```tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ReactQueryProvider>  {/* ✅ 이미 추가됨 */}
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  )
}
```

---

## 기본 사용법

### 패턴 1: 페이지 전체 보호 (가장 기본)

```tsx
// src/app/mypage/page.tsx
'use client'

import { AuthGuard } from '@/components/auth/AuthGuard'
import MyPageContent from '@/components/features/mypage/page/MyPageContent'

export default function MyPage() {
  return (
    <AuthGuard>
      <MyPageContent />
    </AuthGuard>
  )
}
```

**동작:**
1. 로그인 안했으면 → `/onboard`로 리다이렉트
2. 로그인 했으면 → `MyPageContent` 렌더링

### 패턴 2: 커스텀 로딩 UI

```tsx
// src/app/auction/page.tsx
'use client'

import { AuthGuard } from '@/components/auth/AuthGuard'
import AuctionContent from '@/components/features/auction/AuctionContent'
import { AuctionSkeleton } from '@/components/skeleton/auction'

export default function AuctionPage() {
  return (
    <AuthGuard fallback={<AuctionSkeleton />}>
      <AuctionContent />
    </AuthGuard>
  )
}
```

**동작:**
- 로딩 중 → `AuctionSkeleton` 표시
- 로그인 안했으면 → 리다이렉트
- 로그인 했으면 → `AuctionContent` 렌더링

### 패턴 3: 커스텀 리다이렉트 경로

```tsx
// src/app/admin/page.tsx
'use client'

import { AuthGuard } from '@/components/auth/AuthGuard'
import AdminContent from '@/components/features/admin/AdminContent'

export default function AdminPage() {
  return (
    <AuthGuard redirectTo="/login">
      <AdminContent />
    </AuthGuard>
  )
}
```

**동작:**
- 로그인 안했으면 → `/login`으로 리다이렉트 (onboard 아님)

---

## 고급 사용법

### useUser Hook 활용

AuthGuard 내부에서 사용자 정보가 필요한 경우:

```tsx
// src/app/mypage/page.tsx
'use client'

import { AuthGuard } from '@/components/auth/AuthGuard'
import { useUser } from '@/hooks/queries/useUser'

export default function MyPage() {
  return (
    <AuthGuard>
      <MyPageContent />
    </AuthGuard>
  )
}

function MyPageContent() {
  const { data: user } = useUser() // 캐시에서 즉시 가져옴
  
  return (
    <div>
      <h1>안녕하세요 {user?.name}님</h1>
      <p>이메일: {user?.email}</p>
    </div>
  )
}
```

### useUserData Hook (더 빠름)

로딩 상태가 필요 없고 Zustand만 사용할 때:

```tsx
'use client'

import { AuthGuard } from '@/components/auth/AuthGuard'
import { useUserData } from '@/hooks/queries/useUser'

export default function ChatPage() {
  return (
    <AuthGuard>
      <ChatContent />
    </AuthGuard>
  )
}

function ChatContent() {
  const user = useUserData() // Zustand에서 즉시 반환 (더 빠름!)
  
  return <div>채팅방 - {user?.name}</div>
}
```

**차이점:**

| Hook | 데이터 소스 | 로딩 상태 | 사용 시점 |
|------|------------|----------|----------|
| `useUser()` | ReactQuery | ✅ 있음 | API 재검증 필요시 |
| `useUserData()` | Zustand | ❌ 없음 | UI만 표시할 때 |

### Layout에서 공통 적용

여러 페이지에 일괄 적용하려면:

```tsx
// src/app/(protected)/layout.tsx
'use client'

import { AuthGuard } from '@/components/auth/AuthGuard'

export default function ProtectedLayout({ children }) {
  return (
    <AuthGuard fallback={<div>로딩중...</div>}>
      {children}
    </AuthGuard>
  )
}
```

폴더 구조:
```
src/app/
  (protected)/        👈 새로운 route group
    layout.tsx        👈 AuthGuard 한 번만
    mypage/
      page.tsx        👈 AuthGuard 불필요
    auction/
      page.tsx        👈 AuthGuard 불필요
    chat/
      page.tsx        👈 AuthGuard 불필요
```

---

## 실전 예제

### 예제 1: 마이페이지

```tsx
// src/app/mypage/page.tsx
'use client'

import { AuthGuard } from '@/components/auth/AuthGuard'
import { Profile } from '@/components/features/mypage/Profile'
import { ListingTaps } from '@/components/features/mypage/ListingTaps'
import { useUserData } from '@/hooks/queries/useUser'

export default function MyPage() {
  return (
    <AuthGuard fallback={<MyPageSkeleton />}>
      <MyPageContent />
    </AuthGuard>
  )
}

function MyPageContent() {
  const user = useUserData()
  
  return (
    <div className="p-4">
      <Profile user={user!} />
      <ListingTaps className="mt-4" />
    </div>
  )
}

function MyPageSkeleton() {
  return (
    <div className="p-4 animate-pulse">
      <div className="h-20 bg-gray-200 rounded" />
      <div className="h-40 bg-gray-200 rounded mt-4" />
    </div>
  )
}
```

### 예제 2: 경매 페이지

```tsx
// src/app/auction/[id]/page.tsx
'use client'

import { AuthGuard } from '@/components/auth/AuthGuard'
import { AuctionDetail } from '@/components/features/auction/AuctionDetail'
import { AuctionDetailSkeleton } from '@/components/skeleton/auction'
import { useUserData } from '@/hooks/queries/useUser'

export default function AuctionDetailPage({ params }: { params: { id: string } }) {
  return (
    <AuthGuard fallback={<AuctionDetailSkeleton />}>
      <AuctionDetailContent auctionId={params.id} />
    </AuthGuard>
  )
}

function AuctionDetailContent({ auctionId }: { auctionId: string }) {
  const user = useUserData()
  
  // TODO: 경매 상세 정보 가져오기
  // const { data: auction } = useAuction(auctionId)
  
  return (
    <div>
      <h1>경매 {auctionId}</h1>
      <p>입찰자: {user?.name}</p>
      {/* <AuctionDetail data={auction} /> */}
    </div>
  )
}
```

### 예제 3: 채팅 페이지

```tsx
// src/app/chat/[id]/page.tsx
'use client'

import { AuthGuard } from '@/components/auth/AuthGuard'
import { ChatRoom } from '@/components/features/chat/ChatRoom'
import { useUserData } from '@/hooks/queries/useUser'

export default function ChatPage({ params }: { params: { id: string } }) {
  return (
    <AuthGuard>
      <ChatRoomContent roomId={params.id} />
    </AuthGuard>
  )
}

function ChatRoomContent({ roomId }: { roomId: string }) {
  const user = useUserData()
  
  return (
    <ChatRoom 
      roomId={roomId}
      currentUserId={user!.id}
      currentUserName={user!.name}
    />
  )
}
```

### 예제 4: 권한 체크 (Broker 전용)

```tsx
// src/app/listings/new/page.tsx
'use client'

import { AuthGuard } from '@/components/auth/AuthGuard'
import { useUserData } from '@/hooks/queries/useUser'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function NewListingPage() {
  return (
    <AuthGuard>
      <BrokerOnlyContent />
    </AuthGuard>
  )
}

function BrokerOnlyContent() {
  const user = useUserData()
  const router = useRouter()
  
  useEffect(() => {
    // 중개인이 아니면 리다이렉트
    if (user && !user.isBroker) {
      alert('중개인만 매물을 등록할 수 있습니다.')
      router.push('/mypage')
    }
  }, [user, router])
  
  if (!user?.isBroker) {
    return null
  }
  
  return <NewListingForm />
}
```

---

## 캐싱 전략

### ReactQuery 캐싱 동작

```
첫 방문 (mypage):
  useUser() → API 호출 → 캐시 저장 (5분간 유지)

5분 이내 다른 페이지 (auction):
  useUser() → 캐시에서 반환 (API 호출 X)

5분 후 페이지 이동 (chat):
  useUser() → 캐시 데이터 먼저 표시 → 백그라운드 재검증
```

### 캐시 수동 관리

#### 1. 로그아웃 시 캐시 초기화

```tsx
import { useQueryClient } from '@tanstack/react-query'
import { invalidateUser } from '@/hooks/queries/useUser'
import { useUserStore } from '@/store/user'

function LogoutButton() {
  const queryClient = useQueryClient()
  const { clearUser } = useUserStore()
  
  const handleLogout = async () => {
    await logoutApi()
    
    // ReactQuery 캐시 무효화
    invalidateUser(queryClient)
    
    // Zustand 초기화
    clearUser()
    
    router.push('/onboard')
  }
  
  return <button onClick={handleLogout}>로그아웃</button>
}
```

#### 2. 프로필 수정 시 캐시 업데이트

```tsx
import { useQueryClient } from '@tanstack/react-query'
import { updateUserCache } from '@/hooks/queries/useUser'

function EditProfileForm() {
  const queryClient = useQueryClient()
  
  const handleSubmit = async (newProfile: Partial<User>) => {
    // API 호출
    await updateProfileApi(newProfile)
    
    // 캐시 직접 업데이트 (재요청 없이)
    updateUserCache(queryClient, (oldUser) => ({
      ...oldUser!,
      ...newProfile,
    }))
    
    alert('프로필이 수정되었습니다.')
  }
  
  return <form onSubmit={handleSubmit}>...</form>
}
```

---

## 트러블슈팅

### Q1. AuthGuard 안에서 user가 undefined

**원인:** AuthGuard 통과 전에 user 접근

```tsx
// ❌ 잘못된 예시
export default function MyPage() {
  const user = useUserData() // AuthGuard 밖에서 호출
  
  return (
    <AuthGuard>
      <div>{user?.name}</div>  {/* undefined 가능 */}
    </AuthGuard>
  )
}

// ✅ 올바른 예시
export default function MyPage() {
  return (
    <AuthGuard>
      <MyPageContent />
    </AuthGuard>
  )
}

function MyPageContent() {
  const user = useUserData() // AuthGuard 안에서 호출
  return <div>{user?.name}</div>  {/* 항상 있음 */}
}
```

### Q2. 페이지가 깜빡이는 현상

**원인:** Middleware가 제대로 작동하지 않음

**해결:**

```typescript
// src/middleware.ts
export const config = {
  matcher: [
    '/mypage',          // ✅ 경로 자체
    '/mypage/:path*',   // ✅ 하위 경로
    '/auction',
    '/auction/:path*',
    // ... 다른 보호 경로
  ],
}
```

### Q3. 캐시가 갱신되지 않음

**원인:** staleTime이 너무 길게 설정됨

**해결:**

```typescript
// src/hooks/queries/useUser.ts
export function useUser() {
  return useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: fetchCurrentUser,
    staleTime: 1 * 60 * 1000,  // 1분으로 줄이기
  })
}
```

또는 수동 갱신:

```tsx
const queryClient = useQueryClient()
invalidateUser(queryClient)  // 강제 재검증
```

### Q4. Zustand와 ReactQuery 데이터가 다름

**원인:** useEffect 동기화 타이밍 문제

**해결:** 항상 `useUser()` 사용 (최신 데이터 보장)

```tsx
// ❌ 피하기
const user = useUserData() // Zustand (오래된 데이터 가능)

// ✅ 권장
const { data: user } = useUser() // ReactQuery (최신 데이터)
```

### Q5. 개발 중 DevTools가 안 보임

**확인사항:**

1. 개발 모드인지 확인: `npm run dev`
2. 브라우저 우측 하단 확인 (ReactQuery 로고)
3. Provider가 제대로 감싸졌는지 확인

---

## 체크리스트

로그인 필수 페이지 추가 시:

- [ ] `'use client'` 지시어 추가 (AuthGuard는 클라이언트 컴포넌트)
- [ ] `<AuthGuard>`로 컴포넌트 감싸기
- [ ] 커스텀 로딩 UI 필요하면 `fallback` prop 추가
- [ ] 내부 컴포넌트에서 `useUserData()` 또는 `useUser()` 사용
- [ ] Middleware의 `protectedPaths`에 경로 추가
- [ ] Middleware의 `matcher`에 경로 패턴 추가

---

## 참고 자료

- [ReactQuery 공식 문서](https://tanstack.com/query/latest/docs/react)
- [Zustand 공식 문서](https://zustand-demo.pmnd.rs/)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)

---

**작성일:** 2025-11-10  
**마지막 수정:** 2025-11-10

