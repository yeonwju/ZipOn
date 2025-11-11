'use client'

import { AuthGuard } from '@/components/auth'
import { NotificationItem } from '@/components/features/notification'

/**
 * 알림 페이지 Client Component
 * 
 * 보호 레벨:
 * 1차: Middleware (토큰 체크)
 * 2차: AuthGuard (사용자 정보 확인, React Query 캐싱)
 */
export default function NotificationPageClient() {
  return (
    <AuthGuard>
      <section className="p-4">
        <NotificationItem />
        <NotificationItem />
        <NotificationItem />
        <NotificationItem />
        <NotificationItem />
        <NotificationItem />
        <NotificationItem />
        <NotificationItem />
        <NotificationItem />
      </section>
    </AuthGuard>
  )
}

