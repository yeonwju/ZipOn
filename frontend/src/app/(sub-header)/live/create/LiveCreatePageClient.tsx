'use client'

import { Suspense } from 'react'

import { AuthGuard } from '@/components/auth'
import LiveCreateContent from '@/components/features/live/create/LiveCreateContent'
import { LiveCreateSkeleton } from '@/components/skeleton/live'
import { useUser } from '@/queries/useUser'

/**
 * 라이브 방송 생성 페이지 Client Component
 *
 * 보호 레벨:
 * 1차: Middleware (토큰 체크)
 * 2차: AuthGuard (사용자 정보 확인, React Query 캐싱)
 * 3차: 권한 체크 (인증된 중개업자만)
 */
export default function LiveCreatePageClient() {
  const { data: user } = useUser()

  return (
    <AuthGuard>
      {/* 권한 체크: 인증된 중개업자만 라이브 생성 가능 */}
      {user?.isVerified && user?.isBroker ? (
        <Suspense fallback={<LiveCreateSkeleton />}>
          <LiveCreateContent />
        </Suspense>
      ) : (
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="text-center">
            <h2 className="mb-2 text-xl font-bold">접근 권한이 없습니다</h2>
            <p className="mb-4 text-gray-600">라이브 방송 생성은 인증된 중개업자만 가능합니다.</p>
            <a href="/verify/business" className="text-blue-500 hover:underline">
              사업자 인증하러 가기 →
            </a>
          </div>
        </div>
      )}
    </AuthGuard>
  )
}
