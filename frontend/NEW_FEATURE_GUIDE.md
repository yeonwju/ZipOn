# 🚀 새로운 기능 추가 가이드

## 📋 개발 프로세스 (7단계)

새로운 기능을 추가할 때 아래 순서대로 진행하세요!

```
1. 타입 정의
2. API 엔드포인트 상수 추가  
3. API 함수 작성 (백엔드 연동 시)
4. React Query Hook 작성 (백엔드 연동 시)
5. 컴포넌트 생성
6. index.ts에 export 추가
7. 페이지에서 사용
```

---

## 🎯 실전 예제: "찜하기(Like)" 기능 만들기

### Step 1: 타입 정의 📝

#### 📁 `src/types/models/like.ts` (신규 생성)

```typescript
/**
 * 찜하기 도메인 모델
 */

export interface LikeItem {
  id: number
  listingId: number
  userId: number
  createdAt: string
}

export interface LikeListResponse {
  items: LikeItem[]
  total: number
}

export interface LikeRequest {
  listingId: number
}
```

#### 📝 `src/types/models/index.ts` (수정)

```typescript
export * from './listing'
export * from './live'
export * from './user'
export * from './like'  // 🆕 추가!
```

---

### Step 2: API 엔드포인트 상수 추가 📌

#### 📝 `src/constants/api.ts` (수정)

```typescript
export const API_ENDPOINTS = {
  LISTINGS: '/api/listings',
  LIVE: '/api/live',
  
  // 🆕 찜하기 추가!
  LIKES: '/api/likes',
  LIKE_TOGGLE: (listingId: number) => `/api/likes/toggle/${listingId}`,
  USER_LIKES: '/api/user/likes',
} as const
```

---

### Step 3: API 함수 작성 🔧

#### 📁 `src/services/api/likes.ts` (신규 생성)

```typescript
/**
 * 찜하기 API 함수
 */

import type { LikeItem, LikeListResponse } from '@/types/models/like'
import type { ListingData } from '@/types/models/listing'
import { API_ENDPOINTS } from '@/constants'

// 🔄 백엔드 연동 전: Mock 데이터 반환
export async function getLikes(): Promise<LikeListResponse> {
  // TODO: 백엔드 연동 시
  // import { apiClient } from '@/lib/api-client'
  // const response = await apiClient.get(API_ENDPOINTS.LIKES)
  // return response.data
  
  // 임시 Mock
  return Promise.resolve({
    items: [],
    total: 0,
  })
}

// 찜한 매물 목록 조회
export async function getLikedListings(): Promise<ListingData[]> {
  // TODO: 백엔드 연동 시
  // const response = await apiClient.get(API_ENDPOINTS.USER_LIKES)
  // return response.data
  
  return Promise.resolve([])
}

// 찜하기 토글
export async function toggleLike(listingId: number): Promise<{ isLiked: boolean }> {
  // TODO: 백엔드 연동 시
  // const response = await apiClient.post(
  //   API_ENDPOINTS.LIKE_TOGGLE(listingId)
  // )
  // return response.data
  
  console.log('찜하기 토글:', listingId)
  return Promise.resolve({ isLiked: true })
}
```

---

### Step 4: React Query Hook 작성 🎣

#### 📁 `src/hooks/queries/useLikes.ts` (신규 생성)

```typescript
/**
 * 찜하기 React Query Hooks
 */

// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as likesApi from '@/services/api/likes'

// Query Keys
export const likeKeys = {
  all: ['likes'] as const,
  lists: () => [...likeKeys.all, 'list'] as const,
  likedListings: () => [...likeKeys.all, 'liked-listings'] as const,
}

/**
 * 찜한 매물 목록 조회
 * 
 * 🔄 백엔드 연동 시 주석 해제
 */
export function useLikedListings() {
  // return useQuery({
  //   queryKey: likeKeys.likedListings(),
  //   queryFn: likesApi.getLikedListings,
  // })
}

/**
 * 찜하기 토글
 * 
 * 🔄 백엔드 연동 시 주석 해제
 */
export function useToggleLike() {
  // const queryClient = useQueryClient()
  
  // return useMutation({
  //   mutationFn: likesApi.toggleLike,
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: likeKeys.all })
  //   },
  // })
}
```

---

### Step 5: 컴포넌트 생성 🎨

#### 📁 `src/components/features/likes/LikeButton.tsx` (신규)

```typescript
'use client'

import { Heart } from 'lucide-react'
import { useState } from 'react'

interface LikeButtonProps {
  listingId: number
  initialLiked?: boolean
  size?: number
}

export default function LikeButton({ 
  listingId, 
  initialLiked = false,
  size = 24 
}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialLiked)
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setIsLoading(true)

    // 🔄 백엔드 연동 전: 로컬 상태만 변경
    setTimeout(() => {
      setIsLiked(!isLiked)
      setIsLoading(false)
      console.log('찜하기:', listingId, !isLiked ? '추가' : '제거')
    }, 300)

    // 🔄 백엔드 연동 시:
    // const { mutate } = useToggleLike()
    // mutate(listingId, {
    //   onSuccess: (data) => setIsLiked(data.isLiked)
    // })
  }

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`
        flex items-center justify-center rounded-full p-2 transition-all
        ${isLiked ? 'bg-red-50' : 'bg-gray-100'}
        ${isLoading ? 'opacity-50' : ''}
      `}
    >
      <Heart
        size={size}
        className={isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}
      />
    </button>
  )
}
```

#### 📁 `src/components/features/likes/LikeListItem.tsx` (신규)

```typescript
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ROUTES } from '@/constants'
import type { ListingData } from '@/types/models'
import LikeButton from './LikeButton'

interface LikeListItemProps {
  listing: ListingData
}

export default function LikeListItem({ listing }: LikeListItemProps) {
  return (
    <Link 
      href={ROUTES.LISTING_DETAIL(listing.id)}
      className="flex items-center gap-4 border-b p-4 hover:bg-gray-50"
    >
      <Image
        src="/listing.svg"
        alt={listing.name}
        width={80}
        height={80}
        className="rounded-lg"
      />
      
      <div className="flex-1">
        <h3 className="font-semibold">{listing.name}</h3>
        <p className="text-sm text-gray-600">{listing.address}</p>
        <div className="mt-1 text-sm">
          <span className="font-medium text-blue-600">
            {listing.deposit.toLocaleString()}만원
          </span>
          <span className="font-medium text-blue-600">
            {listing.rent.toLocaleString()}만원
          </span>
        </div>
      </div>

      <LikeButton listingId={listing.id} initialLiked={true} />
    </Link>
  )
}
```

---

### Step 6: index.ts에 export 추가 📦

#### 📁 `src/components/features/likes/index.ts` (신규)

```typescript
/**
 * 찜하기 컴포넌트 Barrel Export
 */

export { default as LikeButton } from './LikeButton'
export { default as LikeListItem } from './LikeListItem'
```

#### 📝 `src/components/features/index.ts` (수정)

```typescript
export * from './listings'
export * from './live'
export * from './map'
export * from './home'
export * from './likes'  // 🆕 추가!
```

---

### Step 7: 페이지에서 사용 🎯

#### 📝 `src/app/(sub-header)/like/page.tsx` (수정)

```typescript
'use client'

import { useState, useEffect } from 'react'
import { LikeListItem } from '@/components/features/likes'
import type { ListingData } from '@/types/models'
import { BuildingData } from '@/data/Building'

export default function LikePage() {
  const [likedListings, setLikedListings] = useState<ListingData[]>([])

  useEffect(() => {
    // 임시 Mock 데이터
    setLikedListings(BuildingData.slice(0, 3))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl bg-white">
        <div className="border-b p-4">
          <h1 className="text-xl font-bold">찜한 매물</h1>
          <p className="text-sm text-gray-600">
            {likedListings.length}개
          </p>
        </div>

        {likedListings.length > 0 ? (
          likedListings.map(listing => (
            <LikeListItem key={listing.id} listing={listing} />
          ))
        ) : (
          <div className="py-20 text-center text-gray-500">
            찜한 매물이 없습니다
          </div>
        )}
      </div>
    </div>
  )
}
```

---

## 📊 폴더 구조 예시

### 완성된 "찜하기" 기능 구조

```
src/
├── types/models/
│   ├── like.ts                    # 1️⃣ 타입 정의
│   └── index.ts                   # export 추가
│
├── constants/
│   └── api.ts                     # 2️⃣ 엔드포인트 추가
│
├── services/api/
│   └── likes.ts                   # 3️⃣ API 함수
│
├── hooks/queries/
│   └── useLikes.ts                # 4️⃣ React Query Hook
│
├── components/features/
│   └── likes/                     # 5️⃣ 컴포넌트
│       ├── index.ts               # 6️⃣ Barrel Export
│       ├── LikeButton.tsx
│       └── LikeListItem.tsx
│
└── app/(sub-header)/like/
    └── page.tsx                   # 7️⃣ 페이지에서 사용
```

---
 
## 🔄 다른 기능 추가 예제

### 예제 1: 알림(Notification) 기능

```
1. types/models/notification.ts
2. constants/api.ts (NOTIFICATIONS 추가)
3. services/api/notifications.ts
4. hooks/queries/useNotifications.ts
5. components/features/notifications/
   ├── index.ts
   ├── NotificationItem.tsx
   └── NotificationBadge.tsx
6. app/(sub-header)/notification/page.tsx
```

### 예제 2: 검색(Search) 기능

```
1. types/models/search.ts
2. constants/api.ts (SEARCH 추가)
3. services/api/search.ts
4. hooks/queries/useSearch.ts
5. components/features/search/
   ├── index.ts
   ├── SearchBar.tsx
   ├── SearchResults.tsx
   └── SearchFilters.tsx
6. app/(main)/search/page.tsx
```

---

## ✅ 체크리스트

새 기능 추가 시:

- [ ] **타입 정의** (`types/models/`)
  - 도메인 모델 타입 작성
  - `models/index.ts`에 export 추가
  
- [ ] **상수 추가** (`constants/api.ts`)
  - API 엔드포인트 추가
  
- [ ] **API 함수** (`services/api/`)
  - API 호출 함수 작성
  - 백엔드 연동 전에는 Mock 데이터 반환
  
- [ ] **React Query Hook** (`hooks/queries/`)
  - Custom Hook 작성
  - 백엔드 연동 전에는 `enabled: false` 또는 주석 처리
  
- [ ] **컴포넌트 생성** (`components/features/`)
  - 기능별 폴더 생성
  - 관련 컴포넌트 작성
  
- [ ] **Barrel Export** (`index.ts`)
  - 컴포넌트 폴더에 `index.ts` 생성
  - `features/index.ts`에도 추가
  
- [ ] **페이지 사용**
  - 페이지에서 컴포넌트 import
  - ROUTES 상수 사용
  
- [ ] **빌드 테스트**
  - `npm run build` 실행
  - 오류 없는지 확인

---

## 💡 Import 패턴

### 권장하는 import 순서

```typescript
// 1. React 관련
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// 2. 외부 라이브러리
import { Heart } from 'lucide-react'

// 3. 내부 컴포넌트 (features)
import { LikeButton, LikeListItem } from '@/components/features/likes'
import { ListingCard } from '@/components/features/listings'

// 4. 내부 컴포넌트 (common, layout, ui)
import { Button } from '@/components/ui/button'

// 5. Hooks
import useUserLocation from '@/hooks/map/useUserLocation'

// 6. Types
import type { ListingData } from '@/types/models'

// 7. Constants
import { ROUTES, API_ENDPOINTS } from '@/constants'

// 8. Utils
import { formatPrice } from '@/utils/format'
```

---

## 🎯 핵심 원칙

### 1. **한 가지 책임만**
```typescript
// ✅ Good - 한 가지 일만
export default function LikeButton() { }

// ❌ Bad - 여러 기능 혼재
export default function LikeAndShareButton() { }
```

### 2. **재사용 가능하게**
```typescript
// ✅ Good - Props로 유연하게
interface LikeButtonProps {
  listingId: number
  size?: number
  variant?: 'default' | 'compact'
}

// ❌ Bad - 하드코딩
const SIZE = 24 // 고정값
```

### 3. **백엔드 연동 대비**
```typescript
// ✅ Good - TODO 주석으로 표시
export async function getLikes() {
  // TODO: 백엔드 연동 시
  // const response = await apiClient.get(...)
  // return response.data
  
  return Promise.resolve([]) // Mock
}
```

### 4. **index.ts 활용**
```typescript
// ✅ Good - 간결
import { LikeButton, LikeListItem } from '@/components/features/likes'

// ❌ Bad - 길고 복잡
import LikeButton from '@/components/features/likes/LikeButton'
import LikeListItem from '@/components/features/likes/LikeListItem'
```

---

## 🚀 빠른 시작 템플릿

### 새 기능 추가 시 복붙용!

```bash
# 1. 타입 파일 생성
touch src/types/models/[기능명].ts
# → interface 정의
# → models/index.ts에 export 추가

# 2. API 엔드포인트 추가
# → constants/api.ts 수정

# 3. API 함수 생성
touch src/services/api/[기능명].ts
# → API 함수 작성 (Mock 데이터)

# 4. React Query Hook 생성
touch src/hooks/queries/use[기능명].ts
# → Custom Hook 작성 (주석 처리)

# 5. 컴포넌트 폴더 생성
mkdir src/components/features/[기능명]
touch src/components/features/[기능명]/index.ts
# → 컴포넌트 작성
# → index.ts에 export

# 6. features/index.ts에 추가
# → export * from './[기능명]'

# 7. 페이지에서 사용
# → import { Component } from '@/components/features/[기능명]'

# 8. 빌드 테스트
npm run build
```

---

## 📚 참고

- `src/lib/README.md` - API 클라이언트 설정
- `src/services/api/README.md` - API 함수 작성법
- `src/hooks/queries/README.md` - React Query 사용법

---

## 💬 팁

1. **작은 단위로 개발**
   - 타입 → API → Hook → 컴포넌트 순서대로
   - 각 단계마다 빌드 테스트

2. **Mock 데이터 먼저**
   - UI 먼저 완성
   - 백엔드 준비되면 API 연결

3. **재사용 고려**
   - 다른 곳에서도 쓸 수 있게 설계
   - Props로 유연성 확보

4. **문서화**
   - JSDoc 주석 작성
   - TODO 주석으로 할 일 표시

Happy Coding! 🎉

