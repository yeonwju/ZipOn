'use client'

import { useEffect } from 'react'
import { Profile } from '@/components/features'
import ListingTaps from '@/components/features/mypage/ListingTaps'
import { User, useUserStore } from '@/store/user'

interface MyPageClientProps {
  user: User | null
}

export default function MyPageClient({ user }: MyPageClientProps) {
  const { setUser } = useUserStore()

  // ✅ SSR에서 받은 user를 Zustand에 반영
  useEffect(() => {
    setUser(user)
  }, [user, setUser])

  return (
    <section className="flex w-full flex-col p-4 pb-18">
      <section>
        <Profile />
      </section>
      <ListingTaps className={'mt-4'} isBroker={user?.isBroker} />
    </section>
  )
}
