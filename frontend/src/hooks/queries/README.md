# hooks/queries/

React Query 커스텀 훅을 관리하는 폴더입니다.

## 📁 구조

```
hooks/queries/
├── useListings.ts     # 매물 목록 조회
├── useListing.ts      # 매물 상세 조회
├── useLive.ts         # 라이브 조회
└── useUser.ts         # 사용자 정보
```

## 🔜 백엔드 연동 시 추가 예정

### useListings.ts 예시
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/react-query'
import * as listingsApi from '@/services/api/listings'
import type { FilterState } from '@/types/filter'

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
    mutationFn: ({ id, data }: { id: number; data: any }) => 
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

