'use client'

import { AuthGuard } from '@/components/auth'
import { Profile } from '@/components/features'
import ListingTaps from '@/components/features/mypage/ListingTaps'

/**
 * MyPage Client Component
 *
 * React Query로 사용자 정보를 관리합니다.
 * 하위 컴포넌트들은 useUser Hook으로 사용자 정보를 가져옵니다.
 *
 * 보호 레벨:
 * 1차: Middleware (토큰 체크)
 * 2차: AuthGuard (사용자 정보 확인, React Query 캐싱)
 */
export default function MyPageClient() {
  return (
    <AuthGuard>
      <MyPageContent />
    </AuthGuard>
  )
}

/**
 * MyPage 실제 컨텐츠
 */
function MyPageContent() {
  return (
    <section className="flex w-full flex-col p-4 pb-16">
      <section>
        <Profile />
      </section>
      <ListingTaps className={'mt-4'} />
    </section>
  )
}
