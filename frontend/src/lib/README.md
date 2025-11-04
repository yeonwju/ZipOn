# lib/

라이브러리 설정 및 공통 유틸리티를 관리하는 폴더입니다.

## 📁 구조

```
lib/
├── api-client.ts      # API 클라이언트 설정 (Axios/Fetch)
├── react-query.ts     # React Query 설정
└── utils.ts           # 공통 유틸리티
```

## 🔜 백엔드 연동 시 추가 예정

### api-client.ts
```typescript
import axios from 'axios'
import { API_BASE_URL, API_TIMEOUT } from '@/constants'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // 에러 처리
    return Promise.reject(error)
  }
)
```

### react-query.ts
```typescript
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1분
      gcTime: 5 * 60 * 1000, // 5분
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

export const queryKeys = {
  listings: {
    all: ['listings'] as const,
    list: (filters?: any) => [...queryKeys.listings.all, 'list', filters] as const,
    detail: (id: number) => [...queryKeys.listings.all, 'detail', id] as const,
  },
  live: {
    all: ['live'] as const,
    list: () => [...queryKeys.live.all, 'list'] as const,
    detail: (id: number) => [...queryKeys.live.all, 'detail', id] as const,
  },
}
```

