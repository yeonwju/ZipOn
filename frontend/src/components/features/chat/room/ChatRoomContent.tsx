'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { useEffect } from 'react'

import ChatRoom from '@/components/features/chat/room/ChatRoom'
import { chatQueryKeys } from '@/constants'
import { useGetChatRoomHistory, useGetChatRoomList } from '@/hooks/queries/useChat'
import { useUser } from '@/hooks/queries/useUser'

interface ChatRoomContentProps {
  authToken: string | null
}

export default function ChatRoomContent({ authToken }: ChatRoomContentProps) {
  const params = useParams()
  const queryClient = useQueryClient()

  // 유저 정보
  const { data: user } = useUser()
  const currentUserSeq = user?.userSeq ?? 1

  // 채팅방 정보
  const roomId = Number(params.id)
  const chatRoomList = useGetChatRoomList()
  const chatRoom = chatRoomList.data?.find(room => room.roomSeq === roomId)

  // 채팅 내역 (채팅방에 들어올 때마다 최신 데이터 가져오기)
  const { data: messagesData, refetch } = useGetChatRoomHistory(roomId)

  // 채팅방에 들어올 때마다 최신 데이터 가져오기
  useEffect(() => {
    if (roomId) {
      // 쿼리 무효화하여 최신 데이터 가져오기
      queryClient.invalidateQueries({
        queryKey: chatQueryKeys.room(roomId),
      })
      // refetch도 실행
      refetch()
    }
  }, [roomId, queryClient, refetch])

  if (!chatRoom) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">채팅방을 찾을 수 없습니다.</p>
      </div>
    )
  }

  // API 응답이 배열 형태로 반환됨
  const initialMessages = messagesData ?? null

  return (
    <ChatRoom
      roomSeq={roomId}
      partnerName={chatRoom.partner?.name ?? '알 수 없음'}
      partnerProfileImage={chatRoom.partner?.profileImg ?? '/default-profile.svg'}
      initialMessages={initialMessages}
      currentUserSeq={currentUserSeq}
      authToken={authToken}
    />
  )
}
