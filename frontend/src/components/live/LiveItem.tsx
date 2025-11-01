'use client'

import { Eye, MessageCircle } from 'lucide-react'
import Image from 'next/image'

import { LiveItemProps } from '@/data/LiveItem'

export default function LiveItem({
  imgSrc,
  title,
  viewCnt,
  chatCnt,
  brokerName,
  brokerImgSrc,
}: LiveItemProps) {
  return (
    <div
      className={
        'flex cursor-pointer flex-row items-center gap-4 border-b border-gray-100 px-3 py-3 transition-all duration-200 hover:bg-gray-50'
      }
    >
      {/* 썸네일 */}
      <Image
        src={imgSrc}
        width={155}
        height={145}
        alt="라이브 방 이미지"
        className="rounded-lg object-cover"
      />

      {/* 텍스트 정보 */}
      <div className="flex flex-col justify-between">
        {/* 제목 */}
        <span className="mb-1 line-clamp-2 text-sm font-medium text-gray-900">{title}</span>

        {/* 브로커 */}
        <div className="mb-2 flex flex-row items-center gap-2 text-xs text-gray-500">
          <Image
            src={brokerImgSrc}
            alt="브로커 이미지"
            width={18}
            height={18}
            className="rounded-full border border-gray-200"
          />
          <span className="font-normal text-gray-600">{brokerName}</span>
        </div>

        {/* 조회수 + 채팅 수 */}
        <div className="flex flex-row items-center gap-4 text-[10px] text-gray-500">
          <div className="flex flex-row items-center gap-1">
            <Eye size={13} className="text-gray-400" />
            <span>{viewCnt.toLocaleString()}</span>
          </div>
          <div className="flex flex-row items-center gap-1">
            <MessageCircle size={11} className="text-gray-400" />
            <span>{chatCnt.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
