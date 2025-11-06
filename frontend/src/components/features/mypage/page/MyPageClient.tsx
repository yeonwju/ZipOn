'use client'

import { useEffect } from 'react'
import { Profile } from '@/components/features'
import ListingTaps from '@/components/features/mypage/ListingTaps'
import { useUserStore } from '@/store/user'
import { User } from '@/types/models/user'

interface MyPageClientProps {
  user: User | null
}

export default function MyPageClient({ user }: MyPageClientProps) {
  const { setUser } = useUserStore()

  useEffect(() => {
    console.log('user', user)
    setUser(user)
  }, [user, setUser])

  return (
    <section className="flex w-full flex-col p-4 pb-16">
      <section>
        <Profile />
      </section>
      <ListingTaps className={'mt-4'} />
    </section>
  )
}
