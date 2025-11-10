'use client'

import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

import { useUser } from '@/hooks/queries/useUser'

interface AuthGuardProps {
  /**
   * 인증 성공시 렌더링할 컴포넌트
   */
  children: React.ReactNode

  /**
   * 로딩 중에 표시할 컴포넌트
   * @default <AuthGuardFallback />
   */
  fallback?: React.ReactNode

  /**
   * 인증 실패시 리다이렉트할 경로
   * @default '/onboard'
   */
  redirectTo?: string
}

/**
 * 로그인 필수 페이지를 보호하는 컴포넌트
 *
 * ### 동작 방식
 * 1. 사용자 정보 확인 (useUser 호출)
 * 2. 로딩중이면 fallback 표시
 * 3. 로그인 안했으면 redirectTo로 리다이렉트
 * 4. 로그인 했으면 children 렌더링
 *
 * ### 특징
 * - ReactQuery 캐시 활용 (첫 호출만 API 요청)
 * - Middleware와 함께 사용하여 2중 방어
 * - 커스텀 로딩 UI 및 리다이렉트 경로 지정 가능
 *
 * @example
 * ```tsx
 * // 기본 사용
 * export default function MyPage() {
 *   return (
 *     <AuthGuard>
 *       <MyPageContent />
 *     </AuthGuard>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // 커스텀 로딩 UI
 * export default function AuctionPage() {
 *   return (
 *     <AuthGuard fallback={<AuctionSkeleton />}>
 *       <AuctionContent />
 *     </AuthGuard>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // 커스텀 리다이렉트
 * export default function AdminPage() {
 *   return (
 *     <AuthGuard redirectTo="/login">
 *       <AdminContent />
 *     </AuthGuard>
 *   )
 * }
 * ```
 */
export function AuthGuard({
  children,
  fallback = <AuthGuardFallback />,
  redirectTo = '/onboard',
}: AuthGuardProps) {
  const router = useRouter()
  const { data: user, isLoading, isError } = useUser()

  useEffect(() => {
    // 로딩 완료 후 사용자 정보가 없으면 리다이렉트
    if (!isLoading && (!user || isError)) {
      router.replace(redirectTo)
    }
  }, [user, isLoading, isError, router, redirectTo])

  // 로딩 중
  if (isLoading) {
    return <>{fallback}</>
  }

  // 사용자 정보 없음 (곧 리다이렉트됨)
  if (!user || isError) {
    return null
  }

  // 인증 성공
  return <>{children}</>
}

/**
 * 기본 로딩 fallback UI
 */
function AuthGuardFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
        <p className="text-sm text-gray-500">인증 확인 중...</p>
      </div>
    </div>
  )
}
