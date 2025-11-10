# constants/

애플리케이션 전역에서 사용되는 상수들을 관리하는 폴더입니다.

## 📁 파일 구조

```
constants/
├── api.ts           # API 엔드포인트
├── navigation.ts    # 네비게이션 관련 상수
├── queryKeys.ts     # ReactQuery Query Keys
├── routes.ts        # 라우트 경로
└── index.ts         # 중앙 export
```

---

## 📄 각 파일 설명

### api.ts

API 엔드포인트를 관리합니다.

```typescript
import { API_ENDPOINTS } from '@/constants'

// 사용 예시
const response = await fetch(API_ENDPOINTS.USER_INFO)
```

### navigation.ts

네비게이션 관련 상수를 관리합니다.

```typescript
import { NAVIGATION_ITEMS } from '@/constants'

// 사용 예시
<BottomNavigation items={NAVIGATION_ITEMS} />
```

### queryKeys.ts ✨ (NEW)

ReactQuery의 Query Key를 중앙에서 관리합니다.

#### 왜 Query Key를 관리하나요?

1. **일관성**: 같은 데이터에 대해 항상 동일한 Key 사용
2. **오타 방지**: 문자열 직접 입력 대신 함수로 생성
3. **타입 안정성**: TypeScript로 타입 보장
4. **캐시 무효화 쉬움**: Key 구조 한눈에 파악

#### 사용 방법

```typescript
import { queryKeys } from '@/constants'

// 현재 사용자 정보
useQuery({
  queryKey: queryKeys.user.me(),
  queryFn: fetchCurrentUser,
})

// 매물 목록 (필터 포함)
useQuery({
  queryKey: queryKeys.listing.list({ type: 'apt' }),
  queryFn: () => fetchListings({ type: 'apt' }),
})

// 캐시 무효화
queryClient.invalidateQueries({ 
  queryKey: queryKeys.user.all  // 모든 사용자 관련 쿼리 무효화
})
```

#### Query Key 구조

```typescript
queryKeys.user.me()           // ['user', 'me']
queryKeys.user.profile(123)   // ['user', 'profile', 123]

queryKeys.listing.list()           // ['listing', 'list']
queryKeys.listing.list({ type })   // ['listing', 'list', { type }]
queryKeys.listing.detail(456)      // ['listing', 'detail', 456]

queryKeys.auction.bidHistory(789)  // ['auction', 'bidHistory', 789]
```

#### 새로운 Query Key 추가하기

```typescript
// src/constants/queryKeys.ts

export const myFeatureQueryKeys = {
  all: ['myFeature'] as const,
  lists: () => [...myFeatureQueryKeys.all, 'list'] as const,
  detail: (id: number) => [...myFeatureQueryKeys.all, 'detail', id] as const,
} as const

// queryKeys 객체에 추가
export const queryKeys = {
  user: userQueryKeys,
  listing: listingQueryKeys,
  myFeature: myFeatureQueryKeys,  // 👈 추가
  // ...
} as const
```

### routes.ts

라우트 경로를 관리합니다.

```typescript
import { ROUTES } from '@/constants'

// 사용 예시
router.push(ROUTES.HOME)
```

---

## 💡 사용 팁

### 1. 한 곳에서 import

```typescript
// ✅ Good - index.ts를 통해 import
import { API_ENDPOINTS, queryKeys, ROUTES } from '@/constants'

// ❌ Bad - 개별 파일에서 import
import { API_ENDPOINTS } from '@/constants/api'
import { queryKeys } from '@/constants/queryKeys'
```

### 2. 상수는 대문자, 함수는 camelCase

```typescript
// 상수
API_ENDPOINTS.USER_INFO
NAVIGATION_ITEMS

// 함수 (Query Keys)
queryKeys.user.me()
queryKeys.listing.list()
```

### 3. Query Key는 항상 함수로 호출

```typescript
// ✅ Good
queryKey: queryKeys.user.me()

// ❌ Bad
queryKey: queryKeys.user.me  // 함수를 호출하지 않음
```

---

## 🔜 향후 추가 예정

- `theme.ts` - 테마 관련 상수
- `validation.ts` - 유효성 검사 상수
- `localStorage.ts` - LocalStorage Key 관리

---

**작성일:** 2025-11-10  
**마지막 수정:** 2025-11-10

