# Suspense & Skeleton UI 가이드

이 문서는 프로젝트에서 Suspense와 Skeleton UI를 사용하는 방법을 설명합니다.

## 📚 목차

1. [구조 개요](#구조-개요)
2. [스켈레톤 컴포넌트 위치](#스켈레톤-컴포넌트-위치)
3. [페이지 구조](#페이지-구조)
4. [React Query 적용 방법](#react-query-적용-방법)
5. [새로운 페이지 추가하기](#새로운-페이지-추가하기)

---

## 구조 개요

모든 CSR(Client-Side Rendering) 페이지는 다음과 같은 구조를 따릅니다:

```
app/
  [feature]/
    page.tsx          # Server Component (Suspense 래퍼)
components/
  features/
    [feature]/
      ContentComponent.tsx  # Client Component (실제 로직)
  skeleton/
    [feature]/
      Skeleton.tsx    # 로딩 UI
```

### 장점

✅ **React Query와 완벽 호환** - `useSuspenseQuery` 바로 사용 가능  
✅ **선언적 로딩** - useState 불필요  
✅ **자동 에러 처리** - Error Boundary와 연동  
✅ **스트리밍 SSR 준비** - 서버 컴포넌트 전환 용이

---

## 스켈레톤 컴포넌트 위치

모든 스켈레톤은 `components/skeleton/` 아래 기능별로 정리됩니다:

```
components/skeleton/
├── auction/
│   ├── AuctionDetailSkeleton.tsx
│   ├── PaymentDetailSkeleton.tsx
│   ├── CompleteDetailSkeleton.tsx
│   └── index.ts
├── listings/
│   ├── BrokerApplicationSkeleton.tsx
│   ├── BrokerApplySkeleton.tsx
│   ├── NewListingSkeleton.tsx
│   └── index.ts
├── chat/
│   ├── ChatRoomSkeleton.tsx
│   └── index.ts
├── verify/
│   ├── VerifyFormSkeleton.tsx
│   └── index.ts
├── live/
│   ├── LiveCreateSkeleton.tsx
│   └── index.ts
└── mypage/
    ├── AuctionHistoryCardSkeleton.tsx
    ├── AuctionHistoryListSkeleton.tsx
    ├── MyListingCardSkeleton.tsx
    └── MyListingListSkeleton.tsx
```

### 스켈레톤 작성 규칙

1. **실제 컴포넌트와 동일한 레이아웃** 유지
2. **카드 경계선 강조** - `border-2 border-gray-300 shadow-md`
3. **Skeleton 컴포넌트 사용** - `components/ui/skeleton.tsx`

#### 예시

```tsx
import { Skeleton } from '@/components/ui/skeleton'

export default function MyFeatureSkeleton() {
  return (
    <div className="flex flex-col bg-gray-50 px-5 py-6">
      {/* 카드 섹션 */}
      <div className="rounded-2xl border-2 border-gray-300 bg-white p-4 shadow-md">
        <Skeleton className="mb-3 h-6 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  )
}
```

---

## 페이지 구조

### 1. Page Component (Server Component)

페이지 파일은 **Server Component**로 유지하며, Suspense만 사용합니다.

```tsx
// app/feature/page.tsx
import { Suspense } from 'react'

import FeatureContent from '@/components/features/feature/FeatureContent'
import { FeatureSkeleton } from '@/components/skeleton/feature'

export default function FeaturePage() {
  return (
    <Suspense fallback={<FeatureSkeleton />}>
      <FeatureContent />
    </Suspense>
  )
}
```

### 2. Content Component (Client Component)

실제 로직과 UI는 **Client Component**에 작성합니다.

```tsx
// components/features/feature/FeatureContent.tsx
'use client'

import { useSuspenseQuery } from '@tanstack/react-query'

export default function FeatureContent() {
  // TODO 주석으로 React Query 적용 지점 표시
  // TODO: React Query useSuspenseQuery로 교체
  const { data } = useSuspenseQuery({
    queryKey: ['feature', id],
    queryFn: () => fetchFeatureData(id),
  })

  return <FeatureComponent data={data} />
}
```

---

## React Query 적용 방법

### 1. 설치

```bash
npm install @tanstack/react-query
```

### 2. QueryClientProvider 설정

```tsx
// app/layout.tsx
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export default function RootLayout({ children }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1분
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
```

### 3. Content Component에서 사용

각 `*Content.tsx` 파일에서 `TODO` 주석을 찾아 교체하면 됩니다.

#### 예시 1: 경매 상세

```tsx
// components/features/auction/bid/AuctionDetailContent.tsx
'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import { AuctionDetail } from '@/components/features/auction'

export default function AuctionDetailContent() {
  // ✅ TODO 주석 찾아서 교체
  // TODO: React Query useSuspenseQuery로 교체
  const { data } = useSuspenseQuery({
    queryKey: ['auction', 1],
    queryFn: async () => {
      const response = await fetch(`/api/auctions/1`)
      return response.json()
    },
  })

  return (
    <AuctionDetail
      data={data.listing}
      auctionEndTime={new Date(data.endTime)}
      minimumBid={data.minimumBid}
      deposit={data.deposit}
      lessorName={data.lessorName}
      lessorImage={data.lessorImage}
      onBid={handleBid}
    />
  )
}
```

#### 예시 2: 중개인 목록

```tsx
// components/features/listings/brokers/apply/BrokerApplyContent.tsx
'use client'

import { useSuspenseQuery } from '@tanstack/react-query'

export default function BrokerApplyContent() {
  const params = useParams()
  
  // ✅ TODO 주석 찾아서 교체
  const { data: brokers } = useSuspenseQuery({
    queryKey: ['brokers', params.id],
    queryFn: async () => {
      const response = await fetch(`/api/listings/${params.id}/brokers`)
      return response.json()
    },
  })

  return <BrokerApplyPage brokers={brokers} />
}
```

### 4. Error Boundary 추가 (선택사항)

```tsx
// app/feature/page.tsx
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

export default function FeaturePage() {
  return (
    <ErrorBoundary fallback={<ErrorUI />}>
      <Suspense fallback={<FeatureSkeleton />}>
        <FeatureContent />
      </Suspense>
    </ErrorBoundary>
  )
}
```

---

## 새로운 페이지 추가하기

### Step 1: 스켈레톤 컴포넌트 생성

```tsx
// components/skeleton/[feature]/MyFeatureSkeleton.tsx
import { Skeleton } from '@/components/ui/skeleton'

export default function MyFeatureSkeleton() {
  return (
    <div className="flex flex-col bg-gray-50 px-5 py-6">
      <div className="rounded-2xl border-2 border-gray-300 bg-white p-4 shadow-md">
        <Skeleton className="mb-3 h-6 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  )
}
```

```tsx
// components/skeleton/[feature]/index.ts
export { default as MyFeatureSkeleton } from './MyFeatureSkeleton'
```

### Step 2: Content Component 생성

```tsx
// components/features/[feature]/MyFeatureContent.tsx
'use client'

import { useSuspenseQuery } from '@tanstack/react-query'

export default function MyFeatureContent() {
  // TODO: React Query useSuspenseQuery로 교체
  const { data } = useSuspenseQuery({
    queryKey: ['myFeature'],
    queryFn: fetchMyFeatureData,
  })

  return <MyFeature data={data} />
}
```

### Step 3: Page Component 생성

```tsx
// app/my-feature/page.tsx
import { Suspense } from 'react'

import MyFeatureContent from '@/components/features/[feature]/MyFeatureContent'
import { MyFeatureSkeleton } from '@/components/skeleton/[feature]'

export default function MyFeaturePage() {
  return (
    <Suspense fallback={<MyFeatureSkeleton />}>
      <MyFeatureContent />
    </Suspense>
  )
}
```

---

## 현재 적용된 페이지 목록

### Auction (경매)
| 경로 | Content 컴포넌트 | Skeleton |
|------|-----------------|----------|
| `/auction/[id]` | `auction/bid/AuctionDetailContent.tsx` | `AuctionDetailSkeleton` |
| `/auction/[id]/payment/pending` | `auction/payment/PaymentDetailContent.tsx` | `PaymentDetailSkeleton` |
| `/auction/[id]/payment/complete` | `auction/complete/CompleteDetailContent.tsx` | `CompleteDetailSkeleton` |

### Listings (매물)
| 경로 | Content 컴포넌트 | Skeleton |
|------|-----------------|----------|
| `/listings/[id]/brokers` | `listings/brokers/request/BrokerApplicationContent.tsx` | `BrokerApplicationSkeleton` |
| `/listings/[id]/brokers/apply` | `listings/brokers/apply/BrokerApplyContent.tsx` | `BrokerApplySkeleton` |
| `/listings/new` | `listings/form/NewListingContent.tsx` | `NewListingSkeleton` |

### Chat (채팅)
| 경로 | Content 컴포넌트 | Skeleton |
|------|-----------------|----------|
| `/chat/[id]` | `chat/ChatRoomContent.tsx` | `ChatRoomSkeleton` |

### Verify (인증)
| 경로 | Content 컴포넌트 | Skeleton |
|------|-----------------|----------|
| `/verify/phone` | `mypage/verify/PhoneVerifyContent.tsx` | `VerifyFormSkeleton` |
| `/verify/business` | `mypage/verify/BusinessVerifyContent.tsx` | `VerifyFormSkeleton` |

### Live (라이브)
| 경로 | Content 컴포넌트 | Skeleton |
|------|-----------------|----------|
| `/live/create` | `live/LiveCreateContent.tsx` | `LiveCreateSkeleton` |

---

## 주의사항

### ❌ 하지 말아야 할 것

```tsx
// ❌ 나쁜 예: page.tsx에서 'use client' 사용
'use client'
export default function Page() {
  return <Suspense>...</Suspense>
}

// ❌ 나쁜 예: useState로 로딩 관리
const [isLoading, setIsLoading] = useState(true)
if (isLoading) return <Skeleton />
```

### ✅ 해야 할 것

```tsx
// ✅ 좋은 예: page.tsx는 Server Component
export default function Page() {
  return <Suspense>...</Suspense>
}

// ✅ 좋은 예: Content에서 useSuspenseQuery
const { data } = useSuspenseQuery({ ... })
```

---

## API 통신 예시

### API 함수 작성

```tsx
// services/auctionService.ts
export async function fetchAuctionDetail(id: number) {
  const response = await fetch(`/api/auctions/${id}`)
  if (!response.ok) throw new Error('Failed to fetch')
  return response.json()
}
```

### Content Component에서 사용

```tsx
// components/features/auction/bid/AuctionDetailContent.tsx
'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { fetchAuctionDetail } from '@/services/auctionService'

export default function AuctionDetailContent() {
  const params = useParams()
  const id = Number(params.id)

  const { data } = useSuspenseQuery({
    queryKey: ['auction', id],
    queryFn: () => fetchAuctionDetail(id),
    // staleTime: 5 * 60 * 1000, // 5분 (선택사항)
  })

  return (
    <AuctionDetail
      data={data.listing}
      auctionEndTime={new Date(data.endTime)}
      minimumBid={data.minimumBid}
      deposit={data.deposit}
      lessorName={data.lessorName}
      lessorImage={data.lessorImage}
      onBid={handleBid}
    />
  )
}
```

---

## Mutation 예시 (데이터 변경)

### POST/PUT/DELETE 요청

```tsx
'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

export default function BrokerApplicationContent() {
  const queryClient = useQueryClient()
  
  const { mutate } = useMutation({
    mutationFn: async (data) => {
      const response = await fetch('/api/brokers/apply', {
        method: 'POST',
        body: JSON.stringify(data),
      })
      return response.json()
    },
    onSuccess: () => {
      // 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['brokers'] })
    },
  })

  const handleSubmit = (data) => {
    mutate(data)
  }

  return <BrokerApplicationForm onSubmit={handleSubmit} />
}
```

---

## 캐싱 전략

### Query Key 설계

```tsx
// ✅ 좋은 예: 계층적 구조
['auction', id]                    // 특정 경매
['auction', id, 'bids']           // 경매의 입찰 목록
['listings', { type: 'APARTMENT' }] // 필터된 매물

// ❌ 나쁜 예: 평면적 구조
['auctionDetail']
['auctionBids']
```

### 캐시 무효화

```tsx
// 특정 쿼리만 무효화
queryClient.invalidateQueries({ queryKey: ['auction', id] })

// 모든 auction 쿼리 무효화
queryClient.invalidateQueries({ queryKey: ['auction'] })

// 즉시 다시 가져오기
queryClient.refetchQueries({ queryKey: ['auction', id] })
```

---

## Optimistic Update 예시

```tsx
const { mutate } = useMutation({
  mutationFn: updateBroker,
  onMutate: async (newData) => {
    // 이전 데이터 백업
    const previousData = queryClient.getQueryData(['broker', id])
    
    // Optimistic update
    queryClient.setQueryData(['broker', id], newData)
    
    return { previousData }
  },
  onError: (err, newData, context) => {
    // 실패 시 롤백
    queryClient.setQueryData(['broker', id], context.previousData)
  },
  onSettled: () => {
    // 항상 최신 데이터 다시 가져오기
    queryClient.invalidateQueries({ queryKey: ['broker', id] })
  },
})
```

---

## DevTools 사용

개발 중 React Query DevTools를 추가하면 편리합니다:

```tsx
// app/layout.tsx
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export default function RootLayout({ children }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

---

## 폴더 구조 예시

```
src/
├── app/
│   └── auction/
│       └── [id]/
│           ├── page.tsx                    # Server Component (Suspense)
│           └── payment/
│               └── pending/
│                   └── page.tsx            # Server Component (Suspense)
├── components/
│   ├── features/
│   │   └── auction/
│   │       ├── bid/
│   │       │   ├── AuctionDetailContent.tsx    # Client Component (로직)
│   │       │   ├── AuctionDetail.tsx           # UI Component
│   │       │   └── ...
│   │       └── payment/
│   │           └── PaymentDetailContent.tsx    # Client Component (로직)
│   └── skeleton/
│       └── auction/
│           ├── AuctionDetailSkeleton.tsx       # Skeleton UI
│           ├── PaymentDetailSkeleton.tsx       # Skeleton UI
│           └── index.ts
└── services/
    └── auctionService.ts                       # API 함수
```

---

## 마이그레이션 체크리스트

기존 코드를 Suspense로 전환할 때:

- [ ] Page Component에서 `'use client'` 제거
- [ ] Page Component를 Server Component로 변경
- [ ] 로직을 `*Content.tsx`로 분리
- [ ] `useState(isLoading)` 제거
- [ ] `useSuspenseQuery` 추가 (TODO 주석 위치)
- [ ] Skeleton을 `fallback`으로 전달
- [ ] 에러 처리가 필요하면 Error Boundary 추가

---

## 추가 참고자료

- [React Query 공식 문서](https://tanstack.com/query/latest)
- [React Suspense 가이드](https://react.dev/reference/react/Suspense)
- [Next.js 13+ 로딩 UI](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)

---

## FAQ

### Q: 왜 page.tsx와 Content를 분리하나요?

A: Server Component에서는 `'use client'`를 사용할 수 없습니다. Suspense는 Server에서 쓰고, Client 로직(useState, useEffect 등)은 별도 컴포넌트로 분리해야 합니다.

### Q: 스켈레톤이 너무 빨리 사라져요

A: React Query의 `suspenseMinimumDuration` 옵션이나 CSS transition을 사용하세요.

```tsx
const { data } = useSuspenseQuery({
  queryKey: ['data'],
  queryFn: fetchData,
  // 최소 300ms 동안 스켈레톤 표시
  meta: { suspenseMinimumDuration: 300 }
})
```

### Q: 여러 쿼리를 동시에 실행하려면?

A: 여러 `useSuspenseQuery`를 사용하면 자동으로 병렬 처리됩니다.

```tsx
const { data: auction } = useSuspenseQuery({
  queryKey: ['auction', id],
  queryFn: () => fetchAuction(id),
})

const { data: bids } = useSuspenseQuery({
  queryKey: ['auction', id, 'bids'],
  queryFn: () => fetchBids(id),
})

// 두 쿼리가 모두 완료되어야 렌더링됨
```

---

**마지막 업데이트:** 2025-11-09  
**작성자:** ZipOn Team

