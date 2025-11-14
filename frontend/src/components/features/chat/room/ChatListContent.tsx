'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

import ChatRoomList from '@/components/features/chat/room/ChatRoomList'
import { chatQueryKeys } from '@/constants'
import { useGetChatRoomList } from '@/hooks/queries/useChat'
import { useUser } from '@/hooks/queries/useUser'
import {
  ChatNotification,
  connectWS,
  subscribeNotifications,
  unsubscribeNotifications,
} from '@/lib/socket'
import { ChatRoomListResponseData } from '@/types/api/chat'

export default function ChatListContent() {
  const queryClient = useQueryClient()
  const { data: user } = useUser()
  const { data: chatRooms } = useGetChatRoomList()

  useEffect(() => {
    // 사용자 정보가 없으면 구독하지 않음
    if (!user?.userSeq) {
      return
    }

    // 알림 수신 시 캐시 업데이트
    const handleNotification = (notification: ChatNotification) => {
      console.log('🔔 새 채팅 알림:', notification)

      // 채팅방 목록 캐시 업데이트
      queryClient.setQueryData<ChatRoomListResponseData[] | null>(
        chatQueryKeys.rooms(),
        oldData => {
          if (!oldData) return oldData

          return oldData.map(room => {
            // 알림이 온 채팅방 찾기
            if (room.roomSeq === notification.roomSeq) {
              return {
                ...room,
                lastMessage: {
                  content: notification.content,
                  sentAt: notification.sentAt,
                },
                unreadCount: notification.unreadCount,
              }
            }
            return room
          })
        }
      )

      // 채팅방 목록 재정렬을 위해 무효화 (옵션)
      queryClient.invalidateQueries({
        queryKey: chatQueryKeys.rooms(),
      })
    }

    // WebSocket 연결 및 알림 구독
    const initWebSocket = async () => {
      try {
        await connectWS()
        console.log('✅ ChatListContent: WebSocket 연결 성공')

        // 알림 구독 (중복 방지 로직 포함)
        subscribeNotifications(user.userSeq, handleNotification)
        console.log(`✅ ChatListContent: 알림 구독 시작 - /sub/user/notifications/${user.userSeq}`)
      } catch (error) {
        console.error('❌ ChatListContent: WebSocket 연결 실패:', error)
      }
    }

    initWebSocket()

    // 클린업: 구독만 해제 (WebSocket 연결은 유지)
    return () => {
      unsubscribeNotifications(user.userSeq)
      // 주의: WebSocket 연결은 전역이므로 다른 컴포넌트에서도 사용할 수 있어 여기서 끊지 않음
    }
  }, [user?.userSeq, queryClient])

  return <ChatRoomList chatRooms={chatRooms} />
}
