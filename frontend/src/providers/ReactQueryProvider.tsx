'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

/**
 * ReactQuery Provider
 *
 * 전체 앱에서 사용할 QueryClient를 제공합니다.
 * - 데이터 캐싱 및 서버 상태 관리
 * - 자동 리페칭 및 백그라운드 업데이트
 * - 개발 환경에서 DevTools 제공
 */
export function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 5분간 데이터를 fresh 상태로 유지 (이 시간 동안은 재요청 안함)
            staleTime: 5 * 60 * 1000,

            // 10분간 캐시 보관 (이후 가비지 컬렉션)
            gcTime: 10 * 60 * 1000,

            // 윈도우 포커스시 자동 리페칭 비활성화
            refetchOnWindowFocus: false,

            // 컴포넌트 마운트시 자동 리페칭 비활성화
            refetchOnMount: false,

            // 실패시 1번만 재시도
            retry: 1,

            // 에러시 자동 재시도 간격 (밀리초)
            retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
          },
          mutations: {
            // mutation 실패시 재시도 안함
            retry: false,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* 개발 환경에서만 DevTools 표시 */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} position="bottom" />
      )}
    </QueryClientProvider>
  )
}

