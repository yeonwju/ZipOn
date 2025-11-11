'use client'

import { useParams } from 'next/navigation'

import ChatRoom from '@/components/features/chat/room/ChatRoom'
import { chatHistoryDummy, chatHistoryDummy2 } from '@/data/ChatHistoryDummy'
import { chatRoomListDummy } from '@/data/ChatRoomListDummy'
import { useUser } from '@/hooks/queries/useUser'

export default function ChatRoomContent() {
  const params = useParams()
  const roomId = Number(params.id)
  const { data: user } = useUser()
  const currentUserSeq = user?.userSeq ?? 1

  // TODO: React Query useSuspenseQuery로 교체
  const chatRoom = chatRoomListDummy.find(room => room.roomSeq === roomId)

  if (!chatRoom) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">채팅방을 찾을 수 없습니다.</p>
      </div>
    )
  }

  // 더미 데이터 선택 (실제로는 API에서 가져옴)
  const messages = roomId === 101 ? chatHistoryDummy : chatHistoryDummy2

  return (
    <ChatRoom
      roomSeq={roomId}
      partnerName={chatRoom.partnerName ?? '알 수 없음'}
      partnerProfileImage={chatRoom.profileImgSrc ?? '/default-profile.svg'}
      initialMessages={messages}
      currentUserSeq={currentUserSeq}
    />
  )
}
