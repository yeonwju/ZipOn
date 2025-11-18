'use client'

import { AuthGuard } from '@/components/auth'

/**
 * 찜한 매물 페이지 Client Component
 *
 * 보호 레벨:
 * 1차: Middleware (토큰 체크)
 * 2차: AuthGuard (사용자 정보 확인, React Query 캐싱)
 */
export default function LikePageClient() {
  return (
    <AuthGuard>
      <section className="p-4">
        <div className="flex flex-col gap-4"></div>
      </section>
    </AuthGuard>
  )
}
