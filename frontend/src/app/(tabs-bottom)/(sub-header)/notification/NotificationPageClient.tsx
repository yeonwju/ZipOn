'use client'

import { AuthGuard } from '@/components/auth'
import { NotificationItem } from '@/components/features/notification'
import NotificationCard from '@/components/features/notification/NotificationCard'


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
        <NotificationCard type ="CHAT" senderName ="김도현" message="월세 45 쿨거 가능?" time='방금전'/>
        <NotificationCard type='LIVE' itemName="역삼꿀매물" time='방금전'/>
        <NotificationCard type='AUCTION_SOON' itemName='양촌리꿀매물' time='방금전'/>
        <NotificationCard type='AUCTION_WIN' itemName='양촌리' time='방금전'/>
      </section>
    </AuthGuard>
  )
}

