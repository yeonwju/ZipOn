'use client'

import { Video } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { LiveItems } from '@/components/features/live'
import FabDial from '@/components/ui/FabDial'
import { ROUTES } from '@/constants'
import { liveItems } from '@/data/LiveItemDummy'
import { useUserStore } from '@/store/user'
const metadata = liveItems
/**
 * 라이브 방송 페이지 (Server Component)
 *
 * 실시간 매물 라이브 방송 목록을 표시합니다.
 * 향후 API 연결 시 서버에서 라이브 방송 데이터를 가져와 표시합니다.
 */

export default function LivePage() {
  const router = useRouter()
  const { user } = useUserStore()
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
