# 아키텍처 가이드

이 문서는 프로젝트의 데이터 관리 아키텍처와 구조화 방법을 설명합니다.

## 📋 목차

1. [현재 구조](#현재-구조)
2. [언제 이런 구조를 사용해야 하는가?](#언제-이런-구조를-사용해야-하는가)
3. [다른 경우의 대안](#다른-경우의-대안)
4. [구조 선택 가이드라인](#구조-선택-가이드라인)

---

## 🏗️ 현재 구조

현재 프로젝트는 다음과 같은 구조를 사용합니다:

### 1. 서비스 레이어 (`src/services/`)

**목적**: 데이터 소스 중앙 관리

```
src/services/
├── listingService.ts    # 매물 데이터 관리
└── (향후 추가될 서비스들...)
```

**특징:**
- 단일 진실의 원천 (Single Source of Truth)
- 데이터 소스 변경 시 한 곳만 수정
- 에러 처리 및 fallback 관리

### 2. 중개 레이어 (`src/utils/`)

**목적**: API 타입과 내부 타입 간 변환

```
src/utils/
├── filterAdapter.ts     # 필터 데이터 변환
└── (향후 추가될 어댑터들...)
```

**특징:**
- API 구조 변경 시 내부 코드 영향 최소화
- 타입 안전성 보장
- 변환 로직 중앙화

---

## ✅ 언제 이런 구조를 사용해야 하는가?

### 권장 사용 사례

#### 1. **복잡한 데이터 변환이 필요한 경우**

```typescript
// 예: API 응답 구조가 내부 구조와 완전히 다른 경우
// API: { user_name: "John", user_age: 30 }
// 내부: { name: "John", age: 30 }

// ✅ 이런 경우 어댑터 패턴 사용
// src/services/userService.ts
// src/utils/userAdapter.ts
```

#### 2. **여러 곳에서 사용되는 데이터**

```typescript
// 예: 매물 데이터가 지도, 목록, 상세 페이지에서 모두 사용
// ✅ 서비스 레이어로 중앙 관리
// src/services/listingService.ts
```

#### 3. **데이터 소스가 변경될 가능성이 있는 경우**

```typescript
// 예: 개발 중에는 샘플 데이터, 프로덕션에서는 API
// ✅ 서비스 레이어에서 분기 처리
export async function getListings() {
  if (isProduction) return fetchFromAPI()
  return Promise.resolve(SampleData)
}
```

#### 4. **복잡한 비즈니스 로직이 포함된 경우**

```typescript
// 예: 데이터 가공, 캐싱, 에러 복구 등
// ✅ 서비스 레이어에서 처리
export async function getListings() {
  // 캐시 확인
  // API 호출
  // 데이터 가공
  // 에러 처리
  // 반환
}
```

---

## 🎯 다른 경우의 대안

### 단순한 데이터의 경우

#### 직접 컴포넌트에서 처리

```typescript
// ❌ 과도한 추상화 (불필요)
// src/services/configService.ts
export async function getAppConfig() {
  return { theme: 'light', language: 'ko' }
}

// ✅ 단순한 경우 직접 처리
// src/components/App.tsx
const config = { theme: 'light', language: 'ko' }
```

#### 단순 타입은 어댑터 불필요

```typescript
// ❌ 과도한 변환 (불필요)
// API: { count: 10 }
// 내부: { count: 10 }  // 동일한 구조
// → 어댑터 불필요

// ✅ 직접 사용
const response = await fetch('/api/count')
const { count } = await response.json()
```

### 정적 데이터의 경우

```typescript
// ❌ 서비스 레이어 불필요
// export async function getConstants() {
//   return { PI: 3.14, MAX_SIZE: 100 }
// }

// ✅ 상수 파일로 직접 export
// src/constants/app.ts
export const APP_CONSTANTS = {
  PI: 3.14,
  MAX_SIZE: 100,
}
```

### React Query 같은 라이브러리 사용 시

```typescript
// ✅ React Query의 쿼리 함수로 직접 정의 가능
import { useQuery } from '@tanstack/react-query'

// 간단한 경우 직접 처리
const { data } = useQuery({
  queryKey: ['users'],
  queryFn: async () => {
    const res = await fetch('/api/users')
    return res.json()
  },
})

// 복잡한 경우 서비스 레이어 사용
const { data } = useQuery({
  queryKey: ['listings'],
  queryFn: getListings,  // src/services/listingService.ts
})
```

---

## 📊 구조 선택 가이드라인

### 의사결정 트리

```
데이터가 여러 곳에서 사용되는가?
├─ Yes → 서비스 레이어 필요
│   └─ 데이터 변환이 필요한가?
│       ├─ Yes → 서비스 레이어 + 어댑터 레이어
│       └─ No → 서비스 레이어만
│
└─ No → 직접 컴포넌트에서 처리
    └─ 데이터 변환이 필요한가?
        ├─ Yes → 유틸 함수만
        └─ No → 직접 처리
```

### 복잡도별 추천 구조

#### 🟢 단순 (서비스 레이어 불필요)

```typescript
// 정적 데이터
export const APP_CONFIG = { ... }

// 단순 API 호출 (한 곳에서만 사용)
const response = await fetch('/api/simple')
const data = await response.json()
```

#### 🟡 중간 (서비스 레이어만)

```typescript
// 여러 곳에서 사용되지만 변환은 간단
// src/services/userService.ts
export async function getUser(id: number) {
  const res = await fetch(`/api/users/${id}`)
  return res.json()  // 변환 없이 그대로 반환
}
```

#### 🔴 복잡 (서비스 레이어 + 어댑터 레이어)

```typescript
// 여러 곳에서 사용 + 복잡한 변환 + 비즈니스 로직
// src/services/listingService.ts
// src/utils/listingAdapter.ts
// src/utils/filterAdapter.ts
```

---

## 🏛️ 프로젝트 전반적인 아키텍처

### 권장 디렉토리 구조

```
src/
├── services/           # 데이터 소스 중앙 관리
│   ├── listingService.ts
│   ├── userService.ts
│   └── ...
│
├── utils/             # 변환 로직 및 어댑터
│   ├── filterAdapter.ts
│   ├── listingAdapter.ts
│   └── ...
│
├── types/             # 타입 정의
│   ├── api/           # API 타입
│   │   ├── filter.ts
│   │   └── listing.ts
│   ├── filter.ts      # 내부 타입
│   └── listing.ts
│
├── constants/         # 정적 데이터
│   ├── app.ts
│   └── ...
│
└── components/        # UI 컴포넌트
    └── ...
```

### 패턴별 사용 가이드

| 데이터 유형 | 구조 | 예시 |
|------------|------|------|
| 정적 설정값 | `constants/` | 테마, 언어 설정 |
| 단순 API (한 곳만 사용) | 컴포넌트 내 직접 | 통계, 카운터 |
| 공통 API (여러 곳 사용) | `services/` | 매물, 사용자 |
| 복잡한 변환 | `services/` + `utils/` | 필터, 매물 리스트 |
| 타입 변환 필요 | `utils/` (어댑터) | API ↔ 내부 타입 |

---

## 🎯 실전 예시

### 예시 1: 사용자 데이터 관리

```typescript
// ✅ 복잡한 변환이 필요하고 여러 곳에서 사용
// src/services/userService.ts
export async function getCurrentUser() {
  const res = await fetch('/api/user/me')
  const apiUser = await res.json()
  return mapApiUserToInternal(apiUser)  // 어댑터 사용
}

// src/utils/userAdapter.ts
export function mapApiUserToInternal(api: ApiUser): User {
  return {
    id: api.user_id,
    name: api.user_name,
    email: api.user_email,
    // 변환 로직...
  }
}
```

### 예시 2: 앱 설정 관리

```typescript
// ✅ 정적 데이터는 상수 파일로
// src/constants/app.ts
export const APP_CONFIG = {
  name: 'HomeOn',
  version: '1.0.0',
  maxUploadSize: 10 * 1024 * 1024, // 10MB
}
```

### 예시 3: 단순 카운터

```typescript
// ✅ 단순하고 한 곳에서만 사용되는 경우 직접 처리
// src/components/Counter.tsx
const { data: count } = useQuery({
  queryKey: ['count'],
  queryFn: async () => {
    const res = await fetch('/api/count')
    return res.json()
  },
})
```

---

## 📝 결론

### 기본 원칙

1. **필요할 때만 추상화**: 단순한 경우 과도한 추상화는 피하세요
2. **재사용성 고려**: 여러 곳에서 사용되면 서비스 레이어로
3. **변환 필요성 확인**: API와 내부 구조가 다르면 어댑터 사용
4. **복잡도 평가**: 복잡도에 맞는 구조 선택

### 체크리스트

데이터를 추가할 때:

- [ ] 여러 곳에서 사용되는가? → 서비스 레이어
- [ ] 데이터 변환이 필요한가? → 어댑터 레이어
- [ ] 비즈니스 로직이 포함되는가? → 서비스 레이어
- [ ] 정적 데이터인가? → 상수 파일
- [ ] 단순하고 한 곳에서만 사용? → 직접 처리

---

## 🔗 참고 자료

- 서비스 레이어 상세: `src/services/README.md`
- 데이터 통합 가이드: `docs/DATA_INTEGRATION_GUIDE.md`
- 필터 어댑터 구현: `src/utils/filterAdapter.ts`

