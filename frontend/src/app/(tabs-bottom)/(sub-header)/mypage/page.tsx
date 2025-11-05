'use client'

import { Profile } from '@/components/features'
import ListingTaps from '@/components/features/mypage/ListingTaps'
import { useUserStore } from '@/store/user'

/**
 * 마이페이지 (Client Component)
 *
 * 사용자의 프로필, 활동 내역, 설정 등을 표시합니다.
 */
export default function MyPage() {
  const user = useUserStore(state => state.user)
  
  return (
    <section className="flex w-full flex-col p-4 pb-18">
      <section>
        <Profile />
      </section>
      <ListingTaps className={'mt-4'} isBroker={user?.isBroker ?? false} />
    </section>
  )
}
