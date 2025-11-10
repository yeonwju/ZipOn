'use client'

import { Video } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { LiveItems } from '@/components/features/live'
import FabDial from '@/components/ui/FabDial'
import { ROUTES } from '@/constants'
import { liveItems } from '@/data/LiveItemDummy'
import { useUserStore } from '@/store/user'

export default function LiveListContent() {
  const router = useRouter()
  const { user } = useUserStore()

  // TODO: React Query useSuspenseQuery로 교체
  const metadata = liveItems

  const actions = [
    {
      icon: <Video className="h-5 w-5" />,
      name: '라이브 생성',
      onClick: () => router.push(ROUTES.LIVE_CREATE),
    },
  ]

  return (
    <section className={'pb-13.5'}>
      <LiveItems items={metadata} />
      {user?.isVerified && user?.isBroker && <FabDial actions={actions} />}
    </section>
  )
}

