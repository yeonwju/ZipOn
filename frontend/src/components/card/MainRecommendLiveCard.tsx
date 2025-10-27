import { Eye } from 'lucide-react'
import Image from 'next/image'

import { Badge } from '@/components/ui/badge'

export default function MainRecommendLiveCard() {
  return (
    <div className="w-[200px] flex-shrink-0 rounded-2xl bg-white p-3 shadow-sm transition-all duration-200 hover:shadow-md sm:w-[220px] sm:p-4 md:w-[250px] lg:w-[280px]">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
        <Image
          src="/live-room.svg"
          alt="live-room"
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 280px"
        />
        <div className="absolute top-2 left-2">
          <Badge className="bg-red-500/90 px-2 py-0.5 text-[11px] text-white shadow-sm">LIVE</Badge>
        </div>
      </div>

      <div className="mt-3 flex flex-col">
        <Badge variant="secondary" className="w-fit bg-gray-100 text-[11px] text-gray-600">
          투룸
        </Badge>

        <h3 className="mt-2 text-sm leading-snug font-semibold text-gray-900 sm:text-base">
          송파 신축 입주 시작~!!
        </h3>

        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          {/* 프로필 */}
          <div className="flex items-center gap-2">
            <Image
              src="/profile.svg"
              alt="profile"
              width={22}
              height={22}
              className="rounded-full border border-gray-200"
            />
            <span className="font-medium text-gray-600">변가원</span>
          </div>

          {/* 시간 + 시청자수 */}
          <div className="flex items-center gap-3">
            <span>2m ago</span>
            <span className="flex items-center gap-1">
              <Eye size={15} /> 130명 시청중
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
