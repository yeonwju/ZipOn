'use client'

import { Eye, MessageCircle } from 'lucide-react'
import Image from 'next/image'

import { LiveItemProps } from '@/data/LiveItemDummy'

export default function LiveItem({
  imgSrc,
  title,
  viewCnt,
  chatCnt,
  brokerName,
  brokerImgSrc,
}: LiveItemProps) {
  return (
    <div className="flex cursor-pointer flex-row items-center gap-3 border-b border-gray-100 px-3 py-3 transition-all duration-200 hover:bg-gray-50 sm:gap-4 sm:px-4 sm:py-4 lg:gap-6">
      {/* 썸네일 */}
      <div className="flex-shrink-0">
        <Image
          src={imgSrc}
          alt="라이브 방 이미지"
          width={155}
          height={145}
          className="h-[80px] w-[130px] rounded-md object-cover sm:h-[100px] sm:w-[130px] md:h-[120px] md:w-[175px] lg:h-[145px] lg:w-[280px]"
        />
      </div>

      {/* 텍스트 정보 */}
      <div className="flex w-full flex-col justify-between gap-6 sm:gap-6 md:gap-10 lg:gap-15">
        {/* 제목 */}
        <span className="mb-1 line-clamp-2 text-xs font-medium text-gray-900 sm:text-sm md:text-base lg:text-lg">
          {title}
        </span>

        {/* 브로커 */}
        <div>
          <div className="sm:text-md mb-0.5 flex flex-row items-center gap-1 text-[11px] text-gray-500 sm:gap-2 lg:text-lg">
            <Image
              src={brokerImgSrc}
              alt="브로커 이미지"
              width={18}
              height={18}
              className="rounded-full border border-gray-200 sm:h-[20px] sm:w-[20px] lg:h-[25px] lg:w-[25px]"
            />
            <span className="font-normal text-gray-600">{brokerName}</span>
          </div>

          {/* 조회수 + 채팅 수 */}
          <div className="flex flex-row items-center gap-3 text-[10px] text-gray-500 sm:gap-4 sm:text-xs">
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
