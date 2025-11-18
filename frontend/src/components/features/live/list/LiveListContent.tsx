'use client'

import { Video } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { LiveItems } from '@/components/features/live'
import FabDial from '@/components/ui/FabDial'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ROUTES } from '@/constants'
import { useGetLiveList } from '@/queries/useLive'
import { useUser } from '@/queries/useUser'

type LiveStatus = 'LIVE' | 'ENDED'
type SortType = 'LATEST' | 'POPULAR'

export default function LiveListContent() {
  const router = useRouter()
  const { data: user } = useUser()

  // 필터 상태
  const [status, setStatus] = useState<LiveStatus>('LIVE')
  const [sortType, setSortType] = useState<SortType>('LATEST')

  // useSuspenseQuery 사용: Suspense 경계에서 스켈레톤 UI 표시
  const { data } = useGetLiveList({ status, sortType })

  const actions = [
    {
      icon: <Video className="h-5 w-5" />,
      name: '라이브 생성',
      onClick: () => router.push(ROUTES.LIVE_CREATE),
    },
  ]

  return (
    <section className={'pb-13.5'}>
      {/* 필터 영역 */}
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3">
        {/* 방송 상태 필터 */}
        <Select value={status} onValueChange={value => setStatus(value as LiveStatus)}>
          <SelectTrigger className="w-[120px] border-gray-400">
            <SelectValue placeholder="방송 상태" />
          </SelectTrigger>
          <SelectContent className={'border-gray-200 bg-white'}>
            <SelectItem value="LIVE">방송 중</SelectItem>
            <SelectItem value="ENDED">종료됨</SelectItem>
          </SelectContent>
        </Select>

        {/* 정렬 타입 필터 */}
        <Select value={sortType} onValueChange={value => setSortType(value as SortType)}>
          <SelectTrigger className="text-gray-00 w-[120px] border-gray-400">
            <SelectValue placeholder="정렬" />
          </SelectTrigger>
          <SelectContent className={'border-gray-200 bg-white'}>
            <SelectItem value="LATEST">최신순</SelectItem>
            <SelectItem value="POPULAR">인기순</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <LiveItems items={data} />
      {user?.isVerified && user?.isBroker && <FabDial actions={actions} />}
    </section>
  )
}
