import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Eye } from 'lucide-react'

export default function MainRecommendLiveCard() {
  return (
    <div className="w-2/3 max-w-sm rounded-2xl bg-white p-4 shadow-sm transition-all hover:shadow-md">
      {/* 썸네일 */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
        <Image
          src="/live-room.svg"
          alt="live-room"
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute top-2 left-2">
          <Badge className="bg-red-500/90 px-2 py-0.5 text-[11px] text-white shadow-sm">LIVE</Badge>
        </div>
      </div>

      <div className="mt-3 flex flex-col">
        {/* 태그 */}
        <Badge variant="secondary" className="w-fit bg-gray-100 text-[11px] text-gray-600">
          투룸
        </Badge>

        {/* 제목 */}
        <h3 className="mt-2 text-base leading-snug font-semibold text-gray-900">
          송파 신축 입주 시작~!!
        </h3>

        <div className="mt-3 flex flex-row items-center justify-between text-xs text-gray-500">
          {/* 프로필 이미지 */}
          <div className="flex flex-row items-center gap-2">
            <Image
              src="/profile.svg"
              alt="profile"
              width={24}
              height={24}
              className="rounded-full border border-gray-200"
            />
            <span className="font-medium text-gray-600">변가원</span>
          </div>

          {/* 시작 시간? /시청자수 */}
          <div className="flex flex-row items-center gap-3">
            <span>2m ago</span>
            <span className={'flex flex-row items-center gap-1'}>
              <Eye size={'15'} /> 130명 시청중
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
