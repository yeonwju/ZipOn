'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'
import { useShallow } from 'zustand/react/shallow'

import ChatRoomList from '@/components/features/chat/room/ChatRoomList'
import { chatQueryKeys } from '@/constants'
import { useGetChatRoomList } from '@/hooks/queries/useChat'
import { useChatStore } from '@/store/chatStore'
import { useUser } from '@/hooks/queries/useUser'
import {
  ChatNotification,
  connectWS,
  subscribeNotifications,
  unsubscribeNotifications,
} from '@/lib/socket'
import { ChatRoomListResponseData } from '@/types/api/chat'

interface ChatListContentProps {
  authToken: string | null
}

export default function ChatListContent({ authToken }: ChatListContentProps) {
  const queryClient = useQueryClient()
  const { data: user } = useUser()
  const { data: chatRooms, refetch } = useGetChatRoomList()
  const { updateLastMessage, updateUnreadCount } = useChatStore()

  // Zustand에서 마지막 메시지 정보 가져오기
  const lastMessages = useChatStore(
    useShallow(state => state.lastMessages)
  )

  // 서버 데이터와 Zustand 마지막 메시지 병합
  const mergedChatRooms = useMemo(() => {
    if (!chatRooms) return chatRooms

    return chatRooms.map(room => {
      const lastMessageInfo = lastMessages[room.roomSeq]

      // Zustand에 더 최신 메시지가 있으면 병합
      if (lastMessageInfo) {
        const serverSentAt = room.lastMessage?.sentAt
          ? new Date(room.lastMessage.sentAt).getTime()
          : 0
        const zustandSentAt = new Date(lastMessageInfo.sentAt).getTime()

        // Zustand 메시지가 더 최신이면 업데이트
        if (zustandSentAt > serverSentAt) {
          return {
            ...room,
            lastMessage: {
              content: lastMessageInfo.content,
              sentAt: lastMessageInfo.sentAt,
            },
            unreadCount: lastMessageInfo.unreadCount,
          }
        }
      }

      return room
    })
  }, [chatRooms, lastMessages])

  // 채팅 목록에 들어올 때마다 최신 데이터 가져오기 및 Zustand unreadCount 동기화
  useEffect(() => {
    if (user?.userSeq && authToken) {
      // 쿼리 무효화하여 최신 데이터 가져오기
      queryClient.invalidateQueries({
        queryKey: chatQueryKeys.rooms(),
      })
      // refetch도 실행
      refetch()
      
      // 서버 데이터의 unreadCount를 Zustand에 동기화
      if (chatRooms) {
        chatRooms.forEach(room => {
          if (room.unreadCount > 0) {
            updateUnreadCount(room.roomSeq, room.unreadCount)
          }
        })
      }
    }
  }, [user?.userSeq, authToken, queryClient, refetch, chatRooms])

  useEffect(() => {
    // 사용자 정보가 없으면 구독하지 않음
    if (!user?.userSeq) {
      return
    }

    if (!authToken) {
      console.error('❌ ChatListContent: 인증 토큰이 없습니다.')
      return
    }

    // 알림 수신 시 캐시 업데이트
    const handleNotification = (notification: ChatNotification) => {
      console.log('🔔 새 채팅 알림:', notification)

      // Zustand에 마지막 메시지 정보 저장 (unreadCount도 함께 업데이트됨)
      updateLastMessage(notification.roomSeq, {
        content: notification.content,
        sentAt: notification.sentAt,
        sender: notification.sender,
        unreadCount: notification.unreadCount,
      })
      
      // 읽지 않은 메시지 수도 즉시 업데이트 (실시간 뱃지 표시용)
      updateUnreadCount(notification.roomSeq, notification.unreadCount)

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
        await connectWS(authToken)
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
  }, [user?.userSeq, queryClient, authToken, updateLastMessage])

  return <ChatRoomList chatRooms={mergedChatRooms} />
}
