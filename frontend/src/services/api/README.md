# services/api/

API 호출 함수를 관리하는 폴더입니다.

## 📁 구조

```
services/api/
├── listings.ts        # 매물 관련 API
├── live.ts            # 라이브 관련 API
├── user.ts            # 사용자 관련 API
└── upload.ts          # 파일 업로드 API
```

## 🔜 백엔드 연동 시 추가 예정

### listings.ts 예시
```typescript
import { apiClient } from '@/lib/api-client'
import { API_ENDPOINTS } from '@/constants'
import type { ListingData } from '@/types/models/listing'

// 매물 목록 조회
export async function getListings(filters?: any): Promise<ListingData[]> {
  const response = await apiClient.get(API_ENDPOINTS.LISTINGS, { params: filters })
  return response.data
}

// 매물 상세 조회
export async function getListingById(id: number): Promise<ListingData> {
  const response = await apiClient.get(API_ENDPOINTS.LISTING_BY_ID(id))
  return response.data
}

// 매물 등록
export async function createListing(data: any): Promise<ListingData> {
  const response = await apiClient.post(API_ENDPOINTS.LISTING_CREATE, data)
  return response.data
}

// 매물 수정
export async function updateListing(id: number, data: any): Promise<ListingData> {
  const response = await apiClient.put(API_ENDPOINTS.LISTING_BY_ID(id), data)
  return response.data
}

// 매물 삭제
export async function deleteListing(id: number): Promise<void> {
  await apiClient.delete(API_ENDPOINTS.LISTING_BY_ID(id))
}
```

## 현재 상태

현재는 `services/listingService.ts`에서 Mock 데이터를 사용합니다.
백엔드 완료 후 이 폴더의 API 함수들로 전환할 예정입니다.

