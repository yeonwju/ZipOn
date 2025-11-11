# hooks/queries/

React Query 커스텀 훅을 관리하는 폴더입니다.

## 📁 구조

```
hooks/queries/
├── useUser.ts         # ✅ 사용자 정보 (구현됨)
├── useListings.ts     # 🔜 매물 목록 조회 (예정)
├── useListing.ts      # 🔜 매물 상세 조회 (예정)
└── useLive.ts         # 🔜 라이브 조회 (예정)
```

## ✅ 구현된 Hook

### useUser.ts

사용자 정보 조회 및 인증 관리를 위한 Hook입니다.

```typescript
import { useUser, useUserData } from '@/hooks/queries/useUser'

// 1. 전체 Query 객체 반환 (로딩 상태 포함)
function MyPage() {
  const { data: user, isLoading, isError } = useUser()
  
  if (isLoading) return <Loading />
  if (isError) return <Error />
  
  return <div>안녕하세요 {user?.name}님</div>
}

// 2. Zustand에서 즉시 반환 (로딩 상태 없음, 더 빠름)
function ProfileBadge() {
  const user = useUserData()
  
  return <span>{user?.name}</span>
}
```

**자세한 사용법은 [AUTH_GUARD_GUIDE.md](../../../docs/guides/AUTH_GUARD_GUIDE.md)를 참고하세요.**

---

## 🔜 백엔드 연동 시 추가 예정

### useListings.ts 예시
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/react-query'
import * as listingsApi from '@/services/api/listings'
import type { FilterState } from '@/types/filter'
import type { ListingFormInfo, ListingAdditionalInfo } from '@/types/models/listing'

type ListingFormData = ListingFormInfo & ListingAdditionalInfo

// 매물 목록 조회
export function useListings(filters?: FilterState) {
  return useQuery({
    queryKey: queryKeys.listings.list(filters),
    queryFn: () => listingsApi.getListings(filters),
  })
}

// 매물 상세 조회
export function useListing(id: number) {
  return useQuery({
    queryKey: queryKeys.listings.detail(id),
    queryFn: () => listingsApi.getListingById(id),
    enabled: !!id,
  })
}

// 매물 등록
export function useCreateListing() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: listingsApi.createListing,
    onSuccess: () => {
      // 매물 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: queryKeys.listings.all })
    },
  })
}

// 매물 수정
export function useUpdateListing() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ListingFormData> }) => 
      listingsApi.updateListing(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.listings.detail(variables.id) 
      })
      queryClient.invalidateQueries({ queryKey: queryKeys.listings.all })
    },
  })
}
```

### 사용 예시
```typescript
'use client'

import { useListings } from '@/hooks/queries/useListings'

export default function ListingsPage() {
  const { data: listings, isLoading, error } = useListings()
  
  if (isLoading) return <div>로딩 중...</div>
  if (error) return <div>에러 발생</div>
   
  return (
    <div>
      {listings?.map(listing => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  )
}
```

## 현재 상태

현재는 직접 API 호출 대신 `services/listingService.ts`를 사용합니다.
백엔드 완료 후 React Query로 전환할 예정입니다.

