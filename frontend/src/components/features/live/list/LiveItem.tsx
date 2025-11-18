'use client'

import { Eye, Heart, MessageCircle } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

import { normalizeImageUrl, normalizeThumbnailUrl } from '@/utils/format'
import { LiveItemData } from '@/types'
export type LiveItemProps = LiveItemData

export default function LiveItem({
  imgSrc,
  title,
  viewCnt,
  chatCnt,
  brokerName,
  brokerImgSrc,
}: LiveItemProps) {
  const thumbnailUrl = normalizeThumbnailUrl(imgSrc, '/live-room.svg')
  const brokerImageUrl = normalizeImageUrl(brokerImgSrc)
  const isThumbnailExternal = thumbnailUrl.startsWith('https://')
  const isBrokerImageExternal = brokerImageUrl.startsWith('https://')

  return (
    <div className="flex w-full max-w-full cursor-pointer flex-col items-center overflow-hidden rounded-2xl border-1 border-gray-300 transition-all duration-200 hover:bg-gray-50 sm:gap-4 sm:px-4 sm:py-4 lg:gap-6">
      {/* 썸네일 */}
      <div className="w-full max-w-full flex-shrink-0 overflow-hidden rounded-t-2xl">
        <Image
          src={thumbnailUrl}
          alt="라이브 방 이미지"
          width={400}
          height={400}
          className="w-full bg-gray-300 object-cover sm:h-[100px] sm:w-[130px] md:h-[120px] md:w-[175px] lg:h-[145px] lg:w-[280px]"
          unoptimized={isThumbnailExternal}
        />
      </div>

      {/* 텍스트 정보 */}
      <div className="flex w-full min-w-0 flex-col justify-between gap-3 px-4 py-3 sm:gap-6 md:gap-10 lg:gap-15">
        {/* 제목 */}
        <p className="text-md line-clamp-2 font-medium break-words text-gray-900 sm:text-sm md:text-base lg:text-lg">
          {title}
        </p>

        {/* 브로커 */}
        <div className={'flex w-full min-w-0 justify-between gap-2'}>
          <div className="sm:text-md mb-0.5 flex min-w-0 flex-row items-center gap-1 text-[11px] text-gray-500 sm:gap-2 lg:text-lg">
            <Image
              src={brokerImageUrl}
              alt="브로커 이미지"
              width={18}
              height={18}
              className="flex-shrink-0 rounded-full border border-gray-200 sm:h-[20px] sm:w-[20px] lg:h-[25px] lg:w-[25px]"
              unoptimized={isBrokerImageExternal}
            />
            <span className="truncate font-normal text-gray-600">{brokerName}</span>
          </div>

          {/* 조회수 + 채팅 수 */}
          <div className="flex flex-shrink-0 flex-row items-center gap-3 text-[10px] text-gray-500 sm:gap-4 sm:text-xs">
            <div className="flex flex-row items-center gap-1">
              <Heart size={13} className="text-gray-400 sm:size-[15px]" />
              <span>{viewCnt.toLocaleString()}</span>
            </div>
            <div className="flex flex-row items-center gap-1">
              <Eye size={13} className="text-gray-400 sm:size-[15px]" />
              <span>{viewCnt.toLocaleString()}</span>
            </div>
            <div className="flex flex-row items-center gap-1">
              <MessageCircle size={11} className="text-gray-400 sm:size-[13px]" />
              <span>{chatCnt.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
