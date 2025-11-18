'use client'

import Link from 'next/link'

import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { useUser } from '@/queries/useUser'
import { ChatRoomListResponseData } from '@/types/api/chat'
import { normalizeImageUrl } from '@/utils/format'

interface ChatRoomCardProps {
  className?: string
  chatRoom: ChatRoomListResponseData
}

export default function ChatRoomCard({ className, chatRoom }: ChatRoomCardProps) {
  const { data: user } = useUser()
  const userName = user?.name

  /** 💬 날짜 포맷 함수 */
  const formatDate = (isoString: string) => {
    const date = new Date(isoString)
    const now = new Date()

    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()

    if (isToday) {
      const hours = date.getHours()
      const minutes = date.getMinutes().toString().padStart(2, '0')
      const ampm = hours < 12 ? '오전' : '오후'
      const displayHour = hours % 12 === 0 ? 12 : hours % 12
      return `${ampm} ${displayHour}:${minutes}`
    } else {
      return `${date.getMonth() + 1}월 ${date.getDate()}일`
    }
  }

  return (
    <Link
      href={`/chat/${chatRoom.roomSeq}`}
      className={`flex flex-row items-center gap-3 p-3 transition-colors hover:bg-gray-50 active:bg-gray-100${className ?? ''}`}
    >
      <Avatar>
        <AvatarImage
          src={normalizeImageUrl(chatRoom.partner?.profileImg)}
          alt="프로필 이미지"
          className={'h-13 w-13 rounded-full'}
        />
      </Avatar>

      <section className="min-w-0 flex-1">
        <div className="truncate font-medium">{chatRoom.partner?.name ?? '알 수 없음'}</div>
        <div className="truncate text-sm text-gray-500">
          {chatRoom.lastMessage?.content ??
            `${chatRoom.partner?.name ?? '알 수 없음'}님이 ${userName ?? '본인'}을 초대하였습니다.`}
        </div>
      </section>

      <section className="flex flex-col items-end gap-1">
        <div className="text-xs whitespace-nowrap text-gray-400">
          {chatRoom.lastMessage ? formatDate(chatRoom.lastMessage?.sentAt) : '미정'}
        </div>

        {chatRoom.unreadCount > 0 && (
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            {chatRoom.unreadCount}
          </div>
        )}
      </section>
    </Link>
  )
}
