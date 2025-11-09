# API 연동 가이드 📡

백엔드 API를 연동할 때 참고할 가이드입니다.

## 목차
1. [타입 구조](#타입-구조)
2. [API 응답 형식](#api-응답-형식)
3. [서비스 레이어 수정](#서비스-레이어-수정)
4. [컴포넌트 수정](#컴포넌트-수정)
5. [예제 코드](#예제-코드)

---

## 타입 구조

### 📁 타입 파일 위치

```
src/types/
├── api.ts              # 🔥 API 요청/응답 타입 (백엔드 연동용)
├── models/
│   ├── listing.ts      # 매물 도메인 모델
│   ├── user.ts         # 사용자 도메인 모델
│   ├── chat.ts         # 채팅 도메인 모델
│   └── ...
├── filter.ts           # 필터 타입
└── index.ts            # 통합 export
```

### 🎯 타입 사용 규칙

#### 1. **API 요청/응답 타입**: `src/types/api.ts`
```typescript
// ✅ API 호출 시 사용
import type { 
  GetListingsResponse, 
  ListingFilterParams,
  ApiResponse 
} from '@/types/api'
```

#### 2. **도메인 모델 타입**: `src/types/models/`
```typescript
// ✅ 컴포넌트 props, 상태 관리 시 사용
import type { ListingData, ListingDetailData } from '@/types/models/listing'
```

---

## API 응답 형식

### 공통 응답 래퍼

모든 API 응답은 다음 형식을 따릅니다:

```typescript
interface ApiResponse<T> {
  data: T              // 실제 데이터
  message: string      // 응답 메시지
  status: number       // HTTP 상태 코드
  timestamp: number    // 타임스탬프
}
```

### 매물 관련 API

#### 1. 매물 목록 조회
```typescript
GET /api/properties

// 응답 타입
type GetListingsResponse = ApiResponse<ListingData[]>

// 응답 예시
{
  "data": [
    {
      "propertySeq": 1,
      "address": "서울특별시 강남구 테헤란로 1",
      "propertyNm": "강남 푸르지오",
      "latitude": 37.5286,
      "longitude": 127.0469,
      "area": 111,
      "areaP": 33.6,
      "deposit": 43707,
      "mnRent": 1790,
      "fee": 5,
      "buildingType": "ROOM",      // 'ROOM' | 'APARTMENT' | 'HOUSE' | 'OFFICETEL'
      "roomCnt": "1",              // string
      "floor": "1",                // string
      "facing": "N",               // 'N' | 'S' | 'E' | 'W' | 'NE' | 'NW' | 'SE' | 'SW'
      "isAucPref": true            // boolean
    }
  ],
  "message": "조회 성공",
  "status": 200,
  "timestamp": 1699999999
}
```

#### 2. 매물 상세 조회
```typescript
GET /api/properties/{propertySeq}

// 응답 타입
type GetListingDetailResponse = ApiResponse<ListingDetailData>

// 응답 예시
{
  "data": {
    "propertySeq": 1,
    "lessorNm": "김철수",
    "propertyNm": "강남 푸르지오",
    "content": "역세권에 위치한 깔끔한 매물입니다.",
    "address": "서울특별시 강남구 테헤란로 1",
    "latitude": 37.5286,
    "longitude": 127.0469,
    "buildingType": "ROOM",
    "area": 111,
    "areaP": 33.6,
    "pending": 43707,
    "mnRent": 1790,
    "fee": 5,
    "images": ["/listing.svg"],
    "period": "12개월",
    "floor": "1",
    "facing": "N",
    "roomCnt": "1",
    "bathroomCnt": "1",
    "constructionDate": "2010년 1월",
    "parkingCnt": "0",
    "hasElevator": false,
    "petAvailable": false,
    "isAucPref": true,
    "isBrkPref": false,
    "isLinked": false,
    "aucAt": "2025-01-15 14:00:00",
    "aucAvailable": "진행중"
  },
  "message": "조회 성공",
  "status": 200,
  "timestamp": 1699999999
}
```

#### 3. 매물 필터링
```typescript
GET /api/properties/filter

// 요청 파라미터 타입
interface ListingFilterParams {
  isAucPref?: boolean
  buildingType?: 'ROOM' | 'APARTMENT' | 'HOUSE' | 'OFFICETEL' | 'all'
  deposit_min?: number
  deposit_max?: number | null
  rent_min?: number
  rent_max?: number | null
  roomCnt?: string
  area_min?: number
  area_max?: number | null
  floor_min?: number
  floor_max?: number | null
  facing?: 'N' | 'S' | 'E' | 'W' | 'NE' | 'NW' | 'SE' | 'SW'
  latitude?: number
  longitude?: number
  radius?: number
  page?: number
  limit?: number
}
```

---

## 서비스 레이어 수정

### 📍 위치: `src/services/listingService.ts`

현재는 더미 데이터를 반환하지만, 실제 API를 호출하도록 수정합니다.

#### Before (현재 - 더미 데이터)
```typescript
// src/services/listingService.ts
import { BuildingData } from '@/data/BuildingDummy'
import type { ListingData } from '@/types/models/listing'

export async function getListings(): Promise<ListingData[]> {
  // 더미 데이터 반환
  return Promise.resolve(BuildingData)
}
```

#### After (API 연동 후)
```typescript
// src/services/listingService.ts
import type { GetListingsResponse } from '@/types/api'
import type { ListingData } from '@/types/models/listing'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'

export async function getListings(): Promise<ListingData[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/properties`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 쿠키 포함
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: GetListingsResponse = await response.json()
    return result.data
  } catch (error) {
    console.error('매물 목록 조회 실패:', error)
    throw error
  }
}
```

### 매물 상세 조회
```typescript
import type { GetListingDetailResponse } from '@/types/api'
import type { ListingDetailData } from '@/types/models/listing'

export async function getListingDetail(seq: number): Promise<ListingDetailData | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/properties/${seq}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: GetListingDetailResponse = await response.json()
    return result.data
  } catch (error) {
    console.error('매물 상세 조회 실패:', error)
    throw error
  }
}
```

### 필터링된 매물 조회
```typescript
import type { ListingFilterParams } from '@/types/api'

export async function getFilteredListings(
  filters: ListingFilterParams
): Promise<ListingData[]> {
  try {
    // URL 쿼리 파라미터 생성
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value))
      }
    })

    const response = await fetch(
      `${API_BASE_URL}/api/properties/filter?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: GetListingsResponse = await response.json()
    return result.data
  } catch (error) {
    console.error('매물 필터링 조회 실패:', error)
    throw error
  }
}
```

---

## 컴포넌트 수정

Server Component는 그대로 사용 가능하며, Client Component는 필요 시 React Query를 사용합니다.

### Server Component (현재 방식 유지)

```typescript
// src/app/(sub-header)/listings/[id]/page.tsx
import { notFound } from 'next/navigation'
import { getListingDetail } from '@/services/listingService'

export const dynamic = 'force-dynamic'

export default async function ListingPage({ params }: ListingPageProps) {
  const { id } = await params
  const seq = Number(id)

  if (isNaN(seq)) {
    notFound()
  }

  // ✅ 서비스 함수만 수정하면 됨 (컴포넌트는 수정 불필요)
  const listing = await getListingDetail(seq)

  if (!listing) {
    notFound()
  }

  return <ListingDetail listing={listing} />
}
```

### Client Component (React Query 사용 시)

```typescript
// src/hooks/queries/useListings.ts
import { useQuery } from '@tanstack/react-query'
import { getListings } from '@/services/listingService'

export function useListings() {
  return useQuery({
    queryKey: ['listings'],
    queryFn: getListings,
    staleTime: 1000 * 60 * 5, // 5분
  })
}
```

```typescript
// 컴포넌트에서 사용
'use client'

import { useListings } from '@/hooks/queries/useListings'

export function ListingList() {
  const { data: listings, isLoading, error } = useListings()

  if (isLoading) return <div>로딩 중...</div>
  if (error) return <div>에러 발생</div>

  return (
    <div>
      {listings?.map(listing => (
        <ListingCard key={listing.propertySeq} listing={listing} />
      ))}
    </div>
  )
}
```

---

## 예제 코드

### 1. 환경 변수 설정

```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

### 2. Fetch 유틸리티 (선택사항)

```typescript
// src/lib/fetch.ts
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'
  
  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      credentials: 'include',
    })

    if (!response.ok) {
      throw new ApiError(response.status, `HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new Error('네트워크 오류가 발생했습니다.')
  }
}
```

### 3. 서비스 함수 간소화

```typescript
// src/services/listingService.ts
import { fetchApi } from '@/lib/fetch'
import type { GetListingsResponse, GetListingDetailResponse } from '@/types/api'

export async function getListings() {
  const result = await fetchApi<GetListingsResponse>('/api/properties')
  return result.data
}

export async function getListingDetail(seq: number) {
  try {
    const result = await fetchApi<GetListingDetailResponse>(`/api/properties/${seq}`)
    return result.data
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null
    }
    throw error
  }
}
```

---

## 체크리스트 ✅

API 연동 시 다음 항목들을 확인하세요:

### 타입 정의
- [ ] `src/types/api.ts`에서 필요한 API 타입 import
- [ ] 요청 파라미터 타입 확인
- [ ] 응답 데이터 타입 확인

### 서비스 레이어
- [ ] `src/services/` 파일들에서 더미 데이터 import 제거
- [ ] API 호출 코드로 교체
- [ ] 에러 핸들링 추가
- [ ] 환경 변수 설정 확인

### 컴포넌트
- [ ] Server Component는 수정 불필요 (서비스만 수정)
- [ ] Client Component는 필요 시 React Query 적용
- [ ] 로딩/에러 상태 UI 추가

### 테스트
- [ ] API 응답 형식 백엔드와 일치 확인
- [ ] 에러 케이스 테스트 (404, 500 등)
- [ ] 네트워크 오류 시 동작 확인

---

## 주요 타입 정리

### BuildingType (건물 타입)
```typescript
type BuildingType = 'ROOM' | 'APARTMENT' | 'HOUSE' | 'OFFICETEL'

// 표시 이름 매핑
const BUILDING_TYPE_LABELS = {
  ROOM: '원투룸',
  APARTMENT: '아파트',
  HOUSE: '주택/빌라',
  OFFICETEL: '오피스텔',
}
```

### Direction (방향)
```typescript
type Direction = 'N' | 'S' | 'E' | 'W' | 'NE' | 'NW' | 'SE' | 'SW'
```

### 필드명 주의사항
- ✅ `propertySeq` (매물 시퀀스) - ❌ `id`
- ✅ `mnRent` (월세) - ❌ `rent`
- ✅ `isAucPref` (경매 선호) - ❌ `isAuction`
- ✅ `roomCnt` (방 개수, **string**) - ❌ `roomCount`
- ✅ `floor` (층수, **string**) - ❌ `floorNumber`

---

## 문의

API 연동 중 문제가 발생하면:
1. 타입 정의 확인: `src/types/api.ts`
2. 서비스 레이어 확인: `src/services/`
3. 더미 데이터 참고: `src/data/BuildingDummy.ts`, `src/data/ListingDetailDummy.ts`

