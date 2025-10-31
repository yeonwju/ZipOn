# 서비스 레이어 사용 가이드

이 디렉토리는 데이터 소스와 API 연동을 중앙에서 관리하는 서비스 레이어입니다.

## 📁 파일 구조

- `listingService.ts` - 매물 데이터 관리
- `filterAdapter.ts` (예정) - 필터 데이터 변환

## 🔄 데이터 소스 전환 방법

### 현재 상태: 샘플 데이터 사용

현재 `listingService.ts`는 `BuildingData` (샘플 데이터)를 반환합니다.

### API 데이터로 전환하기

`src/services/listingService.ts` 파일의 `getListings()` 함수를 수정하세요:

```typescript
// 변경 전 (샘플 데이터)
export async function getListings(): Promise<ListingData[]> {
  return Promise.resolve(BuildingData)
}

// 변경 후 (API 데이터)
export async function getListings(): Promise<ListingData[]> {
  try {
    const response = await fetch('https://api.example.com/listings')
    if (!response.ok) {
      throw new Error('Failed to fetch listings')
    }
    const data = await response.json()
    return data.listings
  } catch (error) {
    console.error('Failed to fetch listings:', error)
    // 에러 발생 시 샘플 데이터를 fallback으로 반환
    return BuildingData
  }
}
```

**이제 전체 애플리케이션의 데이터 소스가 자동으로 변경됩니다!**

## 🎯 필터 중개 레이어 사용법

필터 데이터는 API 타입과 내부 타입이 다를 수 있습니다. 
이를 변환하기 위해 `filterAdapter.ts`를 사용하세요.

### 필터 데이터 변환

```typescript
import {
  mapApiFilterToInternal,
  mapInternalFilterToApi,
  createDefaultFilters,
} from '@/utils/filterAdapter'

// API 응답을 내부 타입으로 변환
const apiResponse = await fetch('/api/filters')
const apiData = await apiResponse.json()
const internalFilters = mapApiFilterToInternal(apiData)

// 내부 필터를 API 요청으로 변환
const internalFilters = createDefaultFilters()
const apiRequest = mapInternalFilterToApi(internalFilters)
await fetch('/api/listings', {
  method: 'POST',
  body: JSON.stringify(apiRequest),
})
```

### 새로운 필터 추가하기

1. `src/types/api/filter.ts`에 API 타입 추가
2. `src/types/filter.ts`에 내부 타입 추가
3. `src/utils/filterAdapter.ts`에 변환 함수 추가

```typescript
// src/types/api/filter.ts
export type ApiNewFilter = string | number

// src/types/filter.ts  
export type NewFilter = string | number

// src/utils/filterAdapter.ts
export function mapApiNewFilterToInternal(api: ApiNewFilter): NewFilter {
  return api // 변환 로직 추가
}

export function mapInternalNewFilterToApi(filter: NewFilter): ApiNewFilter {
  return filter // 변환 로직 추가
}
```

## 📚 사용 예시

### Server Component에서 사용

```tsx
import { getListings } from '@/services/listingService'

export default async function MapPage() {
  const listings = await getListings()
  return <ClientMapView initialListings={listings} />
}
```

### Client Component에서 사용 (React Query 권장)

```tsx
'use client'
import { useQuery } from '@tanstack/react-query'
import { getListings } from '@/services/listingService'

export default function MapPage() {
  const { data: listings, isLoading } = useQuery({
    queryKey: ['listings'],
    queryFn: getListings,
  })

  if (isLoading) return <div>Loading...</div>
  return <ClientMapView initialListings={listings || []} />
}
```

## ✅ 장점

1. **단일 진실의 원천 (Single Source of Truth)**: 데이터 소스 변경 시 한 곳만 수정
2. **쉬운 테스트**: 샘플 데이터와 API 데이터 간 전환이 쉬움
3. **타입 안전성**: TypeScript로 타입 체크 가능
4. **에러 처리**: 중앙에서 에러 처리 및 fallback 관리
5. **확장성**: 새로운 데이터 소스 추가가 쉬움

## 🔧 유지보수 가이드

### API 구조 변경 시

1. `src/types/api/filter.ts` 수정
2. `src/utils/filterAdapter.ts`의 변환 로직 수정
3. 내부 타입은 변경 불필요 (중개 레이어가 처리)

### 새로운 데이터 소스 추가 시

`listingService.ts`에 새로운 함수 추가:

```typescript
export async function getListingsFromNewSource(): Promise<ListingData[]> {
  // 새 데이터 소스 로직
}
```

### 하이브리드 데이터 소스 (개발/프로덕션)

```typescript
export async function getListings(): Promise<ListingData[]> {
  const isProduction = process.env.NODE_ENV === 'production'
  
  if (isProduction) {
    // 프로덕션: 실제 API
    return fetchFromApi()
  } else {
    // 개발: 샘플 데이터
    return Promise.resolve(BuildingData)
  }
}
```

