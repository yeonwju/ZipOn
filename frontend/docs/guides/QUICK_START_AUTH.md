# AuthGuard 빠른 시작 가이드

## 5분 안에 로그인 필수 페이지 만들기

### 1️⃣ 페이지를 Client Component로 변경

```tsx
'use client'  // 👈 이거 추가
```

### 2️⃣ AuthGuard로 감싸기

```tsx
import { AuthGuard } from '@/components/auth/AuthGuard'

export default function MyPage() {
  return (
    <AuthGuard>
      <div>내 페이지 내용</div>
    </AuthGuard>
  )
}
```

### 3️⃣ 사용자 정보 사용하기

```tsx
import { useUserData } from '@/hooks/queries/useUser'

function MyPageContent() {
  const user = useUserData()
  
  return <div>안녕하세요 {user?.name}님</div>
}
```

**끝! 이제 로그인 안하면 자동으로 onboard로 이동합니다.** 🎉

---

## 커스터마이징

### 로딩 UI 변경

```tsx
<AuthGuard fallback={<MySkeleton />}>
  <MyContent />
</AuthGuard>
```

### 리다이렉트 경로 변경

```tsx
<AuthGuard redirectTo="/login">
  <MyContent />
</AuthGuard>
```

---

## 전체 예제

```tsx
'use client'

import { AuthGuard } from '@/components/auth/AuthGuard'
import { useUserData } from '@/hooks/queries/useUser'

export default function MyPage() {
  return (
    <AuthGuard fallback={<LoadingUI />}>
      <MyPageContent />
    </AuthGuard>
  )
}

function MyPageContent() {
  const user = useUserData()
  
  return (
    <div>
      <h1>마이페이지</h1>
      <p>이름: {user?.name}</p>
      <p>이메일: {user?.email}</p>
    </div>
  )
}

function LoadingUI() {
  return <div>로딩 중...</div>
}
```

---

## 자주 하는 실수 ❌

### 실수 1: AuthGuard 밖에서 user 사용

```tsx
// ❌ 잘못됨
export default function MyPage() {
  const user = useUserData()  // AuthGuard 밖
  
  return (
    <AuthGuard>
      <div>{user?.name}</div>  // undefined 가능!
    </AuthGuard>
  )
}

// ✅ 올바름
export default function MyPage() {
  return (
    <AuthGuard>
      <MyContent />  // 👈 여기 안에서 useUserData() 호출
    </AuthGuard>
  )
}
```

### 실수 2: 'use client' 빠뜨림

```tsx
// ❌ 잘못됨 (Server Component에서 AuthGuard 사용 불가)
export default function MyPage() {
  return <AuthGuard>...</AuthGuard>
}

// ✅ 올바름
'use client'  // 👈 이거 필수!

export default function MyPage() {
  return <AuthGuard>...</AuthGuard>
}
```

---

## 다음 단계

더 자세한 내용은 [AUTH_GUARD_GUIDE.md](./AUTH_GUARD_GUIDE.md)를 참고하세요.

- 고급 사용법
- 캐싱 전략
- 트러블슈팅
- 실전 예제

