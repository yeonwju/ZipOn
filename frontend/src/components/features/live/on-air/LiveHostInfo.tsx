'use client'

import Image from 'next/image'

interface LiveHostInfoProps {
  title: string
  hostName: string
  hostProfileImage?: string
  interaction?: React.ReactNode
}

/**
 * 라이브 방송 정보 및 진행자 프로필
 * - 방송 타이틀
 * - 진행자 프로필 사진
 * - 진행자 이름
 * - 시청자수/좋아요 (옵션)
 */
export default function LiveHostInfo({
  title,
  hostName,
  hostProfileImage = '/profile.svg',
  interaction,
}: LiveHostInfoProps) {
  return (
    <div className="absolute top-16 right-3 left-3 z-10">
      {/* 방송 타이틀 + 인터랙션 */}
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="flex-1 rounded-lg bg-black/40 px-3 py-1.5 backdrop-blur-sm">
          <h1 className="line-clamp-2 text-lg font-semibold text-white">{title}</h1>
        </div>
      </div>

      {/* 진행자 프로필 */}
      <div className={'flex flex-row items-center justify-between gap-1'}>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-black/40 py-0.5 pr-2.5 pl-0.5 backdrop-blur-sm">
          <div className="relative h-6 w-6 overflow-hidden rounded-full">
            <Image
              src={hostProfileImage}
              alt={hostName}
              fill
              className="object-cover"
              sizes="30px"
            />
          </div>
          <span className="text-xs font-medium text-white">{hostName}</span>
        </div>
        {interaction && <div className="flex-shrink-0">{interaction}</div>}
      </div>
    </div>
  )
}
