# 데이터 통합 가이드

이 문서는 API 데이터로 전환하는 방법과 필터 중개 레이어 사용법을 설명합니다.

## 📋 목차

1. [매물 데이터 소스 변경](#매물-데이터-소스-변경)
2. [필터 데이터 변환](#필터-데이터-변환)
3. [새로운 필터 추가](#새로운-필터-추가)
4. [API 구조 변경 대응](#api-구조-변경-대응)

---

## 🔄 매물 데이터 소스 변경

### 현재 구조

현재 애플리케이션은 `BuildingDummy.ts`의 샘플 데이터를 사용합니다.
데이터 소스는 `src/services/listingService.ts`에서 중앙 관리됩니다.

### 변경 방법

**`src/services/listingService.ts` 파일의 `getListings()` 함수만 수정하면 됩니다.**

#### 1단계: 현재 코드 확인

```typescript
// src/services/listingService.ts
export async function getListings(): Promise<ListingData[]> {
  // 현재는 샘플 데이터 반환
  return Promise.resolve(BuildingData)
}
```

#### 2단계: API 연동으로 변경

```typescript
export async function getListings(): Promise<ListingData[]> {
  try {
    // 실제 API 엔드포인트로 변경
    const response = await fetch('https://api.example.com/listings', {
      headers: {
        'Authorization': `Bearer ${process.env.API_TOKEN}`,
      },
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch listings: ${response.statusText}`)
    }
    
    const data = await response.json()
    
    // API 응답 구조에 맞게 매핑 (필요 시)
    return data.listings || data.items || data
  } catch (error) {
    console.error('Failed to fetch listings:', error)
    // 에러 발생 시 샘플 데이터를 fallback으로 반환
    return BuildingData
  }
}
```

#### 3단계: 완료!

이제 **전체 애플리케이션의 데이터 소스가 자동으로 변경**됩니다.

- `src/app/(tabs-bottom)/map/page.tsx` - 자동으로 새 데이터 사용
- 기타 매물 데이터를 사용하는 모든 컴포넌트 - 자동 업데이트

---

## 🎯 필터 데이터 변환

필터 데이터는 API 타입과 내부 타입이 다를 수 있습니다.
`src/utils/filterAdapter.ts`가 이를 자동으로 변환합니다.

### 필터 변환 사용법

#### API 응답을 내부 타입으로 변환

```typescript
import { mapApiFilterToInternal } from '@/utils/filterAdapter'

// API에서 필터 데이터 받아오기
const apiResponse = await fetch('/api/filters')
const apiData: ApiFilterResponse = await apiResponse.json()

// 내부 타입으로 변환
const internalFilters = mapApiFilterToInternal(apiData)

// 사용
setPriceFilter(internalFilters.price)
setRoomCountFilter(internalFilters.roomCount)
// ...
```

#### 내부 타입을 API 요청으로 변환

```typescript
import { mapInternalFilterToApi } from '@/utils/filterAdapter'

// 사용자가 설정한 필터
const userFilters = {
  price: {
    deposit: { min: 1000, max: 5000 },
    rent: { min: 50, max: null },
    maintenance: { min: 0, max: 100 },
  },
  roomCount: 2,
  area: { min: 20, max: 40 },
  floor: 2,
  direction: 'south',
}

// API 요청 형식으로 변환
const apiRequest = mapInternalFilterToApi(userFilters)

// API로 전송
await fetch('/api/listings', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(apiRequest),
})
```

#### 기본 필터 값 생성

```typescript
import { createDefaultFilters } from '@/utils/filterAdapter'

// 기본 필터 값 가져오기
const defaultFilters = createDefaultFilters()

// 초기화 시 사용
setPriceFilter(defaultFilters.price)
setRoomCountFilter(defaultFilters.roomCount)
// ...
```

---

## ➕ 새로운 필터 추가

새로운 필터를 추가하려면 다음 단계를 따르세요:

### 1단계: 타입 정의

#### API 타입 추가 (`src/types/api/filter.ts`)

```typescript
// 새로운 필터 타입 추가
export type ApiPropertyTypeFilter = 'house' | 'apartment' | 'villa' | string

// ApiFilterResponse에 추가
export type ApiFilterResponse = {
  // 기존 필터들...
  price?: ApiPriceFilter
  room_count?: ApiRoomCountFilter
  // ...
  
  // 새로운 필터 추가
  property_type?: ApiPropertyTypeFilter
}
```

#### 내부 타입 추가 (`src/types/filter.ts`)

```typescript
// 새로운 필터 타입 추가
export type PropertyTypeFilter = 'house' | 'apartment' | 'villa'

// FilterState에 추가
export type FilterState = {
  // 기존 필터들...
  price?: PriceFilter
  roomCount?: RoomCountFilter
  // ...
  
  // 새로운 필터 추가
  propertyType?: PropertyTypeFilter
}
```

### 2단계: 변환 함수 추가 (`src/utils/filterAdapter.ts`)

```typescript
/**
 * API 건물 타입 필터를 내부 타입으로 변환
 */
export function mapApiPropertyTypeToInternal(
  apiType?: ApiPropertyTypeFilter
): PropertyTypeFilter {
  if (!apiType) {
    return 'house' // 기본값
  }

  // API 형식 변환 (예: 'residential_house' -> 'house')
  const typeMap: Record<string, PropertyTypeFilter> = {
    residential_house: 'house',
    apartment_building: 'apartment',
    luxury_villa: 'villa',
  }

  return typeMap[apiType] || (apiType as PropertyTypeFilter)
}

/**
 * 내부 건물 타입 필터를 API 타입으로 변환
 */
export function mapInternalPropertyTypeToApi(
  type: PropertyTypeFilter
): ApiPropertyTypeFilter {
  // 내부 형식을 API 형식으로 변환
  const apiTypeMap: Record<PropertyTypeFilter, string> = {
    house: 'residential_house',
    apartment: 'apartment_building',
    villa: 'luxury_villa',
  }

  return apiTypeMap[type] || type
}
```

### 3단계: 전체 변환 함수 업데이트

```typescript
// mapApiFilterToInternal 함수에 추가
export function mapApiFilterToInternal(apiFilter: ApiFilterResponse) {
  return {
    price: mapApiPriceToInternal(apiFilter.price),
    roomCount: mapApiRoomCountToInternal(apiFilter.room_count),
    // ...
    
    // 새로운 필터 추가
    propertyType: mapApiPropertyTypeToInternal(apiFilter.property_type),
  }
}

// mapInternalFilterToApi 함수에 추가
export function mapInternalFilterToApi(filter: {
  price: PriceFilter
  roomCount: RoomCountFilter
  // ...
  propertyType: PropertyTypeFilter
}): ApiFilterRequest {
  return {
    price: mapInternalPriceToApi(filter.price),
    room_count: mapInternalRoomCountToApi(filter.roomCount),
    // ...
    
    // 새로운 필터 추가
    property_type: mapInternalPropertyTypeToApi(filter.propertyType),
  }
}
```

### 4단계: UI 컴포넌트에 추가

필터 UI는 `AllFiltersBottomSheet.tsx` 등에 추가하면 됩니다.

---

## 🔧 API 구조 변경 대응

API 구조가 변경되어도 내부 코드를 수정할 필요가 없습니다.
변환 로직만 수정하면 됩니다.

### 예시: API 필드명 변경

**변경 전:**
```json
{
  "deposit_min": 1000,
  "deposit_max": 5000
}
```

**변경 후:**
```json
{
  "deposit_lower_bound": 1000,
  "deposit_upper_bound": 5000
}
```

### 해결 방법

`src/utils/filterAdapter.ts`의 `mapApiPriceToInternal` 함수만 수정:

```typescript
// 변경 전
export function mapApiPriceToInternal(apiPrice?: ApiPriceFilter): PriceFilter {
  return {
    deposit: {
      min: apiPrice.deposit_min ?? 0,  // ❌ 이제 사용 안 함
      max: apiPrice.deposit_max ?? null,
    },
    // ...
  }
}

// 변경 후
export function mapApiPriceToInternal(apiPrice?: ApiPriceFilter): PriceFilter {
  return {
    deposit: {
      min: apiPrice.deposit_lower_bound ?? 0,  // ✅ 새 필드명
      max: apiPrice.deposit_upper_bound ?? null,
    },
    // ...
  }
}
```

**내부 코드는 전혀 변경할 필요가 없습니다!**

---

## 📚 추가 리소스

- `src/services/README.md` - 서비스 레이어 상세 가이드
- `src/utils/filterAdapter.ts` - 필터 변환 함수 구현
- `src/types/api/filter.ts` - API 타입 정의
- `src/types/filter.ts` - 내부 타입 정의

---

## ✅ 체크리스트

API 연동 전 확인사항:

- [ ] `src/services/listingService.ts`의 `getListings()` 함수 수정
- [ ] `src/types/api/filter.ts`에 API 타입 정의 확인
- [ ] `src/utils/filterAdapter.ts`의 변환 로직 확인
- [ ] 에러 처리 및 fallback 데이터 설정
- [ ] 환경 변수 설정 (API URL, 토큰 등)
- [ ] 테스트 환경에서 샘플 데이터로 동작 확인
- [ ] 프로덕션 환경에서 API 연동 확인

