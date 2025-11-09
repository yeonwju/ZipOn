# 🔍 지도 필터 시스템 완벽 가이드

> 지도 필터 추가/수정부터 아키텍처까지 모든 것을 한 곳에!

---

## 📑 목차

- [⚡ Quick Reference](#-quick-reference) - 바로 사용하기
- [📖 상세 가이드](#-상세-가이드) - 단계별 설명
- [🏗️ 아키텍처](#%EF%B8%8F-아키텍처) - 시스템 이해하기

---

# ⚡ Quick Reference

> 필터 추가할 때 빠르게 참고하세요!

## 🎯 3단계로 필터 추가하기

### 1️⃣ 타입 정의 (`src/types/filter.ts`)

```typescript
// 1. 새 필터 타입 정의
export type YourFilter = 'all' | 'option1' | 'option2'

// 2. FilterState에 추가
export type FilterState = {
  // ... 기존 필터들
  yourFilter?: YourFilter  // ✅ 추가
}
```

---

### 2️⃣ Store 추가 (`src/store/mapFilter.ts`)

```typescript
// 1. 인터페이스에 추가
interface MapFilterState {
  // 상태
  yourFilter?: YourFilter  // ✅
  
  // 액션
  setYourFilter: (filter?: YourFilter) => void  // ✅
  
  // ... 나머지
}

// 2. 초기값 추가
const initialFilterState = {
  // ... 기존 필터들
  yourFilter: undefined,  // ✅
}

// 3. Store 구현
export const useMapFilterStore = create<MapFilterState>()(
  persist(
    (set, get) => ({
      ...initialFilterState,
      
      // 액션 구현
      setYourFilter: (filter?: YourFilter) => set({ yourFilter: filter }),  // ✅
      
      // hasActiveFilters에 추가
      hasActiveFilters: () => {
        const state = get()
        return (
          // ... 기존 체크들 ||
          state.yourFilter !== undefined ||  // ✅
          // ... 나머지
        )
      },
    }),
    {
      name: 'map-filter-storage',
      partialize: (state: MapFilterState) => ({
        // ... 기존 필터들
        yourFilter: state.yourFilter,  // ✅
      }),
    }
  )
)
```

---

### 3️⃣ 필터 로직 (`src/hooks/map/useMapFilter.ts`)

```typescript
export function useMapFilter({ listings }: UseMapFilterParams) {
  // 1. Store에서 가져오기
  const yourFilter = useMapFilterStore(state => state.yourFilter)  // ✅
  
  const filteredListings = useMemo(() => {
    let result = listings
    
    // ... 기존 필터들 ...
    
    // 2. 필터링 로직 추가
    if (yourFilter && yourFilter !== 'all') {
      result = result.filter(listing => {
        // ✅ 여기에 필터링 로직 작성
        return listing.someField === yourFilter
      })
    }
    
    return result
  }, [
    // ... 기존 dependencies,
    yourFilter,  // ✅ 3. dependency 추가
  ])
  
  // ... rest
}
```

---

## 📱 UI에서 사용하기

```typescript
'use client'

import { useMapFilterStore } from '@/store/mapFilter'

export default function YourComponent() {
  // 읽기
  const yourFilter = useMapFilterStore(state => state.yourFilter)
  
  // 쓰기
  const setYourFilter = useMapFilterStore(state => state.setYourFilter)
  
  // 초기화
  const resetAllFilters = useMapFilterStore(state => state.resetAllFilters)
  
  return (
    <div>
      <button onClick={() => setYourFilter('option1')}>
        옵션1 선택
      </button>
      <button onClick={() => resetAllFilters()}>
        전체 초기화
      </button>
    </div>
  )
}
```

---

## ✅ 완료 체크리스트

- [ ] `types/filter.ts` - 타입 정의 + FilterState 추가
- [ ] `store/mapFilter.ts` - 인터페이스, 초기값, 구현, hasActiveFilters, partialize
- [ ] `hooks/map/useMapFilter.ts` - 가져오기, 로직, dependency
- [ ] 테스트: 필터 적용 → 초기화 → 새로고침 후 유지 확인

---

# 📖 상세 가이드

> 실제 예시와 함께 단계별로 배워보세요!

## 🎯 필터 추가 3단계

### 1단계: 타입 정의 (Type Definition)
### 2단계: Store 추가 (State Management)
### 3단계: 필터 로직 추가 (Filter Logic)

---

## 📝 예시: "주차 가능 여부" 필터 추가하기

### 1️⃣ 단계 1: 타입 정의

**파일: `src/types/filter.ts`**

```typescript
/**
 * 주차 필터 타입
 */
export type ParkingFilter = 'all' | 'available' | 'unavailable'
```

**파일: `src/types/filter.ts` (FilterState에 추가)**

```typescript
export type FilterState = {
  price?: PriceFilter
  roomCount?: RoomCountFilter
  area?: AreaFilter
  floor?: FloorFilter
  direction?: DirectionFilter
  parking?: ParkingFilter  // ✅ 새로운 필터 추가
}
```

---

### 2️⃣ 단계 2: Store 추가

**파일: `src/store/mapFilter.ts`**

#### 2-1. 인터페이스에 상태 및 액션 추가

```typescript
interface MapFilterState {
  // 필터 상태
  priceFilter: PriceFilter
  roomCountFilter?: RoomCountFilter
  areaFilter?: AreaFilter
  floorFilter?: FloorFilter
  directionFilter?: DirectionFilter
  buildingType: BuildingType | 'all'
  auctionFilter: AuctionType
  parkingFilter?: ParkingFilter  // ✅ 상태 추가

  // 필터 변경 액션
  setPriceFilter: (filter: PriceFilter) => void
  setRoomCountFilter: (filter?: RoomCountFilter) => void
  setAreaFilter: (filter?: AreaFilter) => void
  setFloorFilter: (filter?: FloorFilter) => void
  setDirectionFilter: (filter?: DirectionFilter) => void
  setBuildingType: (type: BuildingType | 'all') => void
  setAuctionFilter: (type: AuctionType) => void
  setParkingFilter: (filter?: ParkingFilter) => void  // ✅ 액션 추가

  // 유틸리티 액션
  resetAllFilters: () => void
  hasActiveFilters: () => boolean
}
```

#### 2-2. 초기 상태 추가

```typescript
const initialFilterState = {
  priceFilter: {
    deposit: { min: 0, max: null },
    rent: { min: 0, max: null },
    maintenance: { min: 0, max: null },
  },
  roomCountFilter: undefined,
  areaFilter: undefined,
  floorFilter: undefined,
  directionFilter: undefined,
  buildingType: 'all' as const,
  auctionFilter: 'all' as AuctionType,
  parkingFilter: undefined,  // ✅ 초기값 추가
}
```

#### 2-3. Store 구현에 추가

```typescript
export const useMapFilterStore = create<MapFilterState>()(
  persist(
    (set, get) => ({
      // 초기 상태
      ...initialFilterState,

      // 필터 변경 액션
      setPriceFilter: (filter: PriceFilter) => set({ priceFilter: filter }),
      setRoomCountFilter: (filter?: RoomCountFilter) => set({ roomCountFilter: filter }),
      setAreaFilter: (filter?: AreaFilter) => set({ areaFilter: filter }),
      setFloorFilter: (filter?: FloorFilter) => set({ floorFilter: filter }),
      setDirectionFilter: (filter?: DirectionFilter) => set({ directionFilter: filter }),
      setBuildingType: (type: BuildingType | 'all') => set({ buildingType: type }),
      setAuctionFilter: (type: AuctionType) => set({ auctionFilter: type }),
      setParkingFilter: (filter?: ParkingFilter) => set({ parkingFilter: filter }),  // ✅ 액션 구현

      // 모든 필터 초기화
      resetAllFilters: () => set(initialFilterState),

      // 활성 필터 존재 여부 확인
      hasActiveFilters: () => {
        const state = get()
        return (
          state.buildingType !== 'all' ||
          state.auctionFilter !== 'all' ||
          state.roomCountFilter !== undefined ||
          state.areaFilter !== undefined ||
          state.floorFilter !== undefined ||
          state.directionFilter !== undefined ||
          state.parkingFilter !== undefined ||  // ✅ 활성 체크 추가
          state.priceFilter.deposit.min > 0 ||
          state.priceFilter.deposit.max !== null ||
          state.priceFilter.rent.min > 0 ||
          state.priceFilter.rent.max !== null ||
          state.priceFilter.maintenance.min > 0 ||
          state.priceFilter.maintenance.max !== null
        )
      },
    }),
    {
      name: 'map-filter-storage',
      partialize: (state: MapFilterState) => ({
        priceFilter: state.priceFilter,
        roomCountFilter: state.roomCountFilter,
        areaFilter: state.areaFilter,
        floorFilter: state.floorFilter,
        directionFilter: state.directionFilter,
        buildingType: state.buildingType,
        auctionFilter: state.auctionFilter,
        parkingFilter: state.parkingFilter,  // ✅ 영속화에 추가
      }),
    }
  )
)
```

---

### 3️⃣ 단계 3: 필터 로직 추가

**파일: `src/hooks/map/useMapFilter.ts`**

```typescript
export function useMapFilter({ listings }: UseMapFilterParams) {
  // Store에서 필터 상태 가져오기
  const buildingType = useMapFilterStore(state => state.buildingType)
  const auctionFilter = useMapFilterStore(state => state.auctionFilter)
  const priceFilter = useMapFilterStore(state => state.priceFilter)
  const roomCountFilter = useMapFilterStore(state => state.roomCountFilter)
  const areaFilter = useMapFilterStore(state => state.areaFilter)
  const floorFilter = useMapFilterStore(state => state.floorFilter)
  const directionFilter = useMapFilterStore(state => state.directionFilter)
  const parkingFilter = useMapFilterStore(state => state.parkingFilter)  // ✅ 필터 가져오기

  // 필터링된 매물 목록
  const filteredListings = useMemo(() => {
    let result = listings

    // ... 기존 필터들 ...

    // ✅ 주차 필터 적용
    if (parkingFilter && parkingFilter !== 'all') {
      result = result.filter(listing => {
        const hasParkingSpace = listing.parkingCnt && Number(listing.parkingCnt) > 0
        
        if (parkingFilter === 'available') {
          return hasParkingSpace
        } else if (parkingFilter === 'unavailable') {
          return !hasParkingSpace
        }
        
        return true
      })
    }

    return result
  }, [
    listings,
    auctionFilter,
    buildingType,
    priceFilter,
    roomCountFilter,
    areaFilter,
    floorFilter,
    directionFilter,
    parkingFilter,  // ✅ dependency에 추가
  ])

  // ... rest of the code
}
```

---

## 🎨 UI 컴포넌트 연결 (선택사항)

필터 UI를 만들려면:

### 1. 필터 컴포넌트 생성

**파일: `src/components/features/listings/filters/ParkingFilter.tsx`**

```typescript
'use client'

import { useMapFilterStore } from '@/store/mapFilter'
import type { ParkingFilter as ParkingFilterType } from '@/types/filter'

const OPTIONS: { value: ParkingFilterType; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'available', label: '주차 가능' },
  { value: 'unavailable', label: '주차 불가' },
]

export default function ParkingFilter() {
  // Store에서 직접 가져오기
  const parkingFilter = useMapFilterStore(state => state.parkingFilter)
  const setParkingFilter = useMapFilterStore(state => state.setParkingFilter)

  return (
    <div className="flex gap-2">
      {OPTIONS.map(option => (
        <button
          key={option.value}
          onClick={() => setParkingFilter(option.value === 'all' ? undefined : option.value)}
          className={`rounded-full px-4 py-2 ${
            (parkingFilter ?? 'all') === option.value
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
```

### 2. AllFiltersBottomSheet에 추가

**파일: `src/components/layout/modal/bottom/AllFiltersBottomSheet.tsx`**

```typescript
import ParkingFilter from '@/components/features/listings/filters/ParkingFilter'

export default function AllFiltersBottomSheet({ isOpen, onClose }: AllFiltersBottomSheetProps) {
  const parkingFilter = useMapFilterStore(state => state.parkingFilter)
  const setParkingFilter = useMapFilterStore(state => state.setParkingFilter)
  
  const [tempParkingFilter, setTempParkingFilter] = useState<ParkingFilter>(
    parkingFilter ?? 'all'
  )

  React.useEffect(() => {
    if (isOpen) {
      setTempParkingFilter(parkingFilter ?? 'all')
    }
  }, [isOpen])

  const handleApply = () => {
    // ... 다른 필터들 ...
    setParkingFilter(tempParkingFilter === 'all' ? undefined : tempParkingFilter)
    onClose()
  }

  const handleReset = () => {
    setTempParkingFilter('all')
    resetAllFilters()
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      {/* ... 다른 필터들 ... */}
      
      {/* ✅ 주차 필터 추가 */}
      <ParkingFilter
        selectedParking={tempParkingFilter}
        onParkingChange={setTempParkingFilter}
      />
    </BottomSheet>
  )
}
```

---

## 💡 팁

### Selector 최적화
여러 필터를 한번에 가져올 때:

```typescript
// ❌ 나쁜 예 - 불필요한 리렌더링
const state = useMapFilterStore()

// ✅ 좋은 예 - 필요한 것만
const parkingFilter = useMapFilterStore(state => state.parkingFilter)
const setParkingFilter = useMapFilterStore(state => state.setParkingFilter)

// ✅ 더 좋은 예 - 여러 개를 한번에
const { parkingFilter, setParkingFilter } = useMapFilterStore(state => ({
  parkingFilter: state.parkingFilter,
  setParkingFilter: state.setParkingFilter,
}))
```

### 초기화 포함하기
필터를 추가하면 **반드시** `resetAllFilters`와 `hasActiveFilters`에도 포함시키세요!

### TypeScript 타입 안전성
모든 액션에 타입을 명시하면 IDE 자동완성과 타입 체크를 받을 수 있습니다.

---

## 🔧 문제 해결

### Q: 필터가 적용되지 않아요
- useMapFilter의 dependency 배열에 필터를 추가했는지 확인
- Store에서 필터를 올바르게 가져오고 있는지 확인

### Q: 새로고침하면 필터가 사라져요
- partialize에 필터를 추가했는지 확인
- localStorage를 확인 (`map-filter-storage` 키)

### Q: 초기화가 안돼요
- initialFilterState에 필터를 추가했는지 확인
- resetAllFilters가 initialFilterState를 사용하는지 확인

---

# 🏗️ 아키텍처

> 시스템을 깊이 이해하고 싶다면 읽어보세요!

## 📊 전체 구조도

```
┌─────────────────────────────────────────────────────────────┐
│                     UI Components                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ MapOverlay   │  │BottomSheets  │  │Other Pages   │      │
│  │              │  │              │  │              │      │
│  │ - 필터 버튼   │  │ - 필터 설정   │  │ - 필터 표시   │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
│         └──────────────────┼──────────────────┘              │
│                            │                                 │
│                            ▼                                 │
│         ┌──────────────────────────────────┐                │
│         │   Zustand Store (mapFilter.ts)   │                │
│         │                                   │                │
│         │  • priceFilter                   │                │
│         │  • roomCountFilter               │                │
│         │  • areaFilter                    │                │
│         │  • floorFilter                   │                │
│         │  • directionFilter               │                │
│         │  • buildingType                  │                │
│         │  • auctionFilter                 │                │
│         │                                   │                │
│         │  Actions:                         │                │
│         │  • setPriceFilter()               │                │
│         │  • setRoomCountFilter()           │                │
│         │  • resetAllFilters()              │                │
│         │  • hasActiveFilters()             │                │
│         └──────────────┬───────────────────┘                │
│                        │                                     │
│                        │ (persist)                           │
│                        ▼                                     │
│         ┌──────────────────────────────┐                    │
│         │  localStorage                 │                    │
│         │  key: 'map-filter-storage'    │                    │
│         └──────────────────────────────┘                    │
└─────────────────────────────────────────────────────────────┘
                         │
                         │ (subscribe)
                         ▼
         ┌──────────────────────────────────┐
         │   useMapFilter Hook              │
         │                                   │
         │  Input: listings[]               │
         │  Output: filteredListings[]      │
         │                                   │
         │  필터링 로직:                      │
         │  1. 경매 타입                     │
         │  2. 건물 타입                     │
         │  3. 가격 범위                     │
         │  4. 방 개수                       │
         │  5. 면적                          │
         │  6. 층수                          │
         │  7. 해방향                        │
         └──────────────┬───────────────────┘
                        │
                        ▼
         ┌──────────────────────────────────┐
         │   ClientMapView                   │
         │                                   │
         │   filteredListings 사용:          │
         │   • 지도에 마커 표시               │
         │   • 매물 목록 표시                │
         └──────────────────────────────────┘
```

---

## 🔄 데이터 흐름

### 1. 사용자가 필터 선택

```
User clicks button
       │
       ▼
Component calls setPriceFilter(newValue)
       │
       ▼
Store updates state
       │
       ├─────► localStorage에 자동 저장 (persist)
       │
       └─────► 모든 구독자에게 알림
```

### 2. 필터 적용

```
Store state 변경
       │
       ▼
useMapFilter가 감지
       │
       ▼
useMemo 재실행
       │
       ▼
filteredListings 업데이트
       │
       ▼
지도 마커 & 목록 자동 업데이트
```

### 3. 페이지 새로고침

```
페이지 로드
       │
       ▼
Store 초기화
       │
       ▼
localStorage에서 필터 복원 (persist)
       │
       ▼
이전 필터 상태 그대로 유지 ✨
```

---

## 📂 파일 구조

```
src/
├── types/
│   └── filter.ts                    # 필터 타입 정의
│
├── store/
│   └── mapFilter.ts                 # 필터 상태 관리 (Zustand)
│
├── hooks/
│   └── map/
│       └── useMapFilter.ts          # 필터링 로직
│
├── components/
│   ├── layout/
│   │   ├── map/
│   │   │   ├── ClientMapView.tsx   # 필터 적용된 매물 사용
│   │   │   └── MapOverlay.tsx      # 필터 버튼 UI
│   │   │
│   │   └── modal/bottom/
│   │       ├── AllFiltersBottomSheet.tsx      # 전체 필터
│   │       ├── PriceFilterBottomSheet.tsx     # 가격 필터
│   │       ├── RoomCountFilterBottomSheet.tsx # 방개수 필터
│   │       └── BuildingTypeBottomSheet.tsx    # 건물 타입
│   │
│   └── features/
│       └── listings/
│           └── filters/
│               ├── PriceFilter.tsx
│               ├── RoomCountFilter.tsx
│               ├── AreaFilter.tsx
│               ├── FloorFilter.tsx
│               └── DirectionFilter.tsx
│
└── docs/
    └── FILTERS.md                   # 이 문서
```

---

## 🎯 핵심 설계 원칙

### 1. 단일 진실의 원천 (Single Source of Truth)
- 모든 필터 상태는 **오직** `mapFilter` store에만 존재
- Props drilling 없음
- 어디서든 동일한 상태 접근

### 2. 관심사의 분리 (Separation of Concerns)

```typescript
// ✅ 좋은 예: 각각의 책임이 명확함

// types/filter.ts - 타입만
export type PriceFilter = { ... }

// store/mapFilter.ts - 상태 관리만
const [priceFilter, setPriceFilter] = useState(...)

// hooks/map/useMapFilter.ts - 필터링 로직만
const filteredListings = useMemo(() => { ... })

// components/ - UI만
<PriceFilter value={...} onChange={...} />
```

### 3. 선언적 프로그래밍
```typescript
// ❌ 명령형
function updateFilter() {
  const filters = getFilters()
  filters.price = newPrice
  setFilters(filters)
  filterListings(filters)
  updateMap(filteredListings)
}

// ✅ 선언형
const setPriceFilter = useMapFilterStore(state => state.setPriceFilter)
setPriceFilter(newPrice)  // 나머지는 자동!
```

### 4. 타입 안전성
- 모든 필터에 명확한 타입 정의
- TypeScript의 자동완성 활용
- 런타임 에러 방지

---

## 🔍 상태 구독 패턴

### Selector를 통한 최적화

```typescript
// ❌ 나쁜 예: 전체 store 구독 (불필요한 리렌더링)
const store = useMapFilterStore()
const priceFilter = store.priceFilter

// ✅ 좋은 예: 필요한 것만 구독
const priceFilter = useMapFilterStore(state => state.priceFilter)

// ✅ 여러 개 구독 시
const { priceFilter, setPriceFilter } = useMapFilterStore(state => ({
  priceFilter: state.priceFilter,
  setPriceFilter: state.setPriceFilter,
}))
```

---

## 🚀 성능 최적화

### 1. useMemo로 필터링 메모이제이션
```typescript
const filteredListings = useMemo(() => {
  // 무거운 필터링 작업
}, [listings, ...allFilters])  // dependency가 변경될 때만 재실행
```

### 2. Persist 미들웨어로 영속성
- 사용자 경험 향상
- 페이지 새로고침 후에도 필터 유지
- 별도 API 호출 불필요

### 3. Partial State Update
```typescript
// ❌ 나쁜 예: 전체 상태 교체
set({ ...allState, priceFilter: newValue })

// ✅ 좋은 예: 필요한 것만 업데이트
set({ priceFilter: newValue })
```

---

## 📝 확장성

### 새 필터 추가가 쉬운 이유

1. **타입 시스템**: 필터 추가 시 누락된 부분을 TypeScript가 알려줌
2. **중앙 집중식**: Store 하나만 수정하면 모든 곳에서 사용 가능
3. **느슨한 결합**: UI와 로직이 완전히 분리됨
4. **일관된 패턴**: 모든 필터가 동일한 패턴을 따름

### 추가 가능한 기능들

- ✅ 필터 프리셋 저장/불러오기
- ✅ 필터 히스토리 (되돌리기/다시하기)
- ✅ 필터 공유 (URL 쿼리스트링)
- ✅ 서버 사이드 필터링 (API 연동)
- ✅ 필터 조합 제약사항 (특정 필터 조합 방지)

---

## 🔧 디버깅

### Zustand DevTools 사용

```typescript
import { devtools } from 'zustand/middleware'

export const useMapFilterStore = create<MapFilterState>()(
  devtools(  // ✅ DevTools 추가
    persist(
      (set, get) => ({ ... }),
      { name: 'map-filter-storage' }
    ),
    { name: 'MapFilter' }  // DevTools에서 표시될 이름
  )
)
```

### 상태 확인

```typescript
// 어디서든 현재 상태 확인
console.log(useMapFilterStore.getState())

// 특정 필터만 확인
console.log(useMapFilterStore.getState().priceFilter)
```

---

## 💡 모범 사례

### DO ✅

- 필터 추가 시 체크리스트 모두 완료
- Selector로 필요한 상태만 구독
- 타입을 명확히 정의
- 초기화 로직에 새 필터 포함

### DON'T ❌

- Props로 필터 전달하지 않기
- Store 외부에 필터 상태 중복 저장하지 않기
- 타입 단언(as) 남용하지 않기
- 전체 store 구독하지 않기

---

## 🎓 추가 학습 자료

- [Zustand 공식 문서](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [React useMemo 가이드](https://react.dev/reference/react/useMemo)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

---

**마지막 업데이트:** 2025-01-09

