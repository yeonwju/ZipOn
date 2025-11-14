'use client'

import { useQueryClient } from '@tanstack/react-query'
import { Menu } from 'lucide-react'
import { useEffect, useMemo, useRef } from 'react'
import { useShallow } from 'zustand/react/shallow'

import SubHeader from '@/components/layout/header/SubHeader'
import { chatQueryKeys } from '@/constants'
import { useCheckChatRoomRead } from '@/hooks/queries/useChat'
import { useUser } from '@/hooks/queries/useUser'
import { ChatMessage, connectWS, sendChat, subscribeChat, unsubscribeChat } from '@/lib/socket'
import { useChatStore } from '@/store/chatStore'
import { ChatRoomHistoryResponseData } from '@/types/api/chat'

import ChatInput from '../message/ChatInput'
import ChatMessageList from '../message/ChatMessageList'

interface ChatRoomProps {
  roomSeq: number
  partnerName: string
  partnerProfileImage?: string
  initialMessages: ChatRoomHistoryResponseData[] | null
  currentUserSeq: number
  authToken: string | null
}

/**
 * WebSocket ChatMessage를 ChatRoomHistoryResponseData로 변환
 */
function convertChatMessageToHistoryData(chatMessage: ChatMessage): ChatRoomHistoryResponseData {
  return {
    messageSeq: chatMessage.messageSeq,
    roomSeq: chatMessage.roomSeq,
    sender: {
      userSeq: chatMessage.sender.userSeq,
      name: chatMessage.sender.name,
      nickname: chatMessage.sender.nickname,
      profileImg: chatMessage.sender.profileImg,
    },
    content: chatMessage.content,
    sentAt: chatMessage.sentAt,
  }
}

export default function ChatRoom({
  roomSeq,
  partnerName,
  partnerProfileImage = '/default-profile.svg',
  initialMessages,
  currentUserSeq,
  authToken,
}: ChatRoomProps) {
  const { data: user } = useUser()
  const queryClient = useQueryClient()
  const prevRoomSeqRef = useRef<number | null>(null)
  
  // 채팅방 읽음 처리 Mutation
  const { mutate: checkChatRoomRead } = useCheckChatRoomRead()

  // Zustand store 사용
  const { setMessages, addMessage, clearUnreadCount } = useChatStore()

  // Zustand에서 메시지 가져오기 (useShallow로 shallow 비교)
  const zustandMessages = useChatStore(
    useShallow(state => {
      const roomData = state.roomMessages[roomSeq]
      return roomData?.messages ?? []
    })
  )

  // 서버에서 받은 메시지와 Zustand 메시지 병합 (useMemo로 메모이제이션)
  const allMessages = useMemo(() => {
    const messages = initialMessages ?? []
    const merged = [...messages]

    // Zustand에 있는 메시지 중 서버 데이터에 없는 것만 추가
    zustandMessages.forEach(zustandMsg => {
      const existsInServer = messages.some(msg => msg.messageSeq === zustandMsg.messageSeq)
      if (!existsInServer) {
        merged.push(zustandMsg)
      }
    })

    // 시간순으로 정렬
    return merged.sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime())
  }, [initialMessages, zustandMessages])

  // roomSeq가 변경되거나 initialMessages가 업데이트되면 Zustand에 저장
  useEffect(() => {
    if (prevRoomSeqRef.current !== roomSeq) {
      // 채팅방이 변경되었으면 이전 채팅방 메시지 정리 (선택사항)
      if (prevRoomSeqRef.current !== null) {
        // 이전 채팅방 메시지는 유지하도록 (필요하면 clearRoomMessages 호출)
      }
      prevRoomSeqRef.current = roomSeq
    }

    // 서버에서 받은 최신 메시지로 Zustand 업데이트
    if (initialMessages && initialMessages.length > 0) {
      setMessages(roomSeq, initialMessages)

      // React Query 캐시도 업데이트
      queryClient.setQueryData<ChatRoomHistoryResponseData[]>(
        chatQueryKeys.room(roomSeq),
        initialMessages
      )
    }
  }, [roomSeq, initialMessages, setMessages, queryClient])

  // 채팅방 진입 시 읽음 처리 및 Zustand unreadCount 초기화
  useEffect(() => {
    if (roomSeq) {
      // 채팅방에 들어왔을 때 읽음 처리
      checkChatRoomRead(roomSeq)
      // Zustand의 unreadCount도 초기화 (즉시 뱃지 제거)
      clearUnreadCount(roomSeq)
      console.log('✅ 채팅방 진입: 읽음 처리 실행', roomSeq)
    }

    // 채팅방 나갈 때 읽음 처리 (cleanup)
    return () => {
      if (roomSeq) {
        checkChatRoomRead(roomSeq)
        console.log('✅ 채팅방 나감: 읽음 처리 실행', roomSeq)
      }
    }
  }, [roomSeq, checkChatRoomRead, clearUnreadCount])

  // WebSocket 연결 및 채팅방 구독
  useEffect(() => {
    let subscription: ReturnType<typeof subscribeChat> | undefined

    const initWebSocket = async () => {
      try {
        // WebSocket 연결 (토큰 포함)
        if (!authToken) {
          console.error('❌ ChatRoom: 인증 토큰이 없습니다.')
          return
        }

        await connectWS(authToken)
        console.log(`✅ ChatRoom: WebSocket 연결 성공 - roomSeq: ${roomSeq}`)

        // 채팅방 구독
        subscription = subscribeChat(roomSeq, handleReceiveMessage)
        console.log(`✅ ChatRoom: 채팅방 구독 시작 - /sub/chat/${roomSeq}`)
      } catch (error) {
        console.error('❌ ChatRoom: WebSocket 연결 실패:', error)
      }
    }

    // 실시간 메시지 수신 처리
    const handleReceiveMessage = (chatMessage: ChatMessage) => {
      console.log('💬 새 메시지 수신:', chatMessage)

      // 메시지를 ChatRoomHistoryResponseData 형식으로 변환
      const newMessage = convertChatMessageToHistoryData(chatMessage)

      // Zustand에 메시지 추가 (중복 체크 포함)
      addMessage(roomSeq, newMessage)

      // React Query 캐시도 업데이트
      queryClient.setQueryData<ChatRoomHistoryResponseData[] | null>(
        chatQueryKeys.room(roomSeq),
        oldData => {
          if (!oldData) {
            return [newMessage]
          }

          // 중복 체크: 같은 messageSeq가 이미 있는지 확인
          const isDuplicate = oldData.some(msg => msg.messageSeq === newMessage.messageSeq)

          if (isDuplicate) {
            console.log('⚠️ 중복 메시지 무시 (캐시):', newMessage.messageSeq)
            return oldData
          }

          // 새 메시지 추가 (중복이 아닌 경우)
          return [...oldData, newMessage]
        }
      )
    }

    initWebSocket()

    // 클린업: 구독 해제 (WebSocket 연결은 유지)
    return () => {
      unsubscribeChat(roomSeq)
      console.log(`🔌 ChatRoom: 채팅방 구독 해제 - /sub/chat/${roomSeq}`)
      // 채팅방을 나갈 때 메시지 정리하지 않음 (다시 들어올 때를 위해 유지)
    }
  }, [roomSeq, authToken, currentUserSeq, queryClient, addMessage])

  // 메시지 전송
  const handleSendMessage = async (content: string) => {
    if (!content.trim()) {
      return
    }

    if (!user) {
      console.error('❌ 사용자 정보가 없습니다.')
      return
    }

    if (!authToken) {
      console.error('❌ 인증 토큰이 없어 메시지를 전송할 수 없습니다.')
      return
    }

    // WebSocket으로 메시지 전송 (서버 응답을 WebSocket으로 받아서 UI에 표시)
    try {
      await sendChat(roomSeq, { content }, authToken)
      console.log('📤 메시지 전송 완료:', content)
    } catch (error) {
      console.error('❌ 메시지 전송 실패:', error)
    }
  }

  const handleMenuClick = () => {
    console.log('메뉴 클릭')
    // TODO: 메뉴 모달 또는 drawer 열기
  }

  return (
    <div className="flex h-screen flex-col">
      <SubHeader
        pathname={`/chat/${roomSeq}`}
        title={partnerName}
        customRightIcons={[
          {
            icon: <Menu size={17} />,
            onClick: handleMenuClick,
          },
        ]}
      />

      {/* 메시지 리스트 */}
      <ChatMessageList
        messages={allMessages}
        currentUserSeq={currentUserSeq}
        partnerProfileImage={partnerProfileImage}
      />

      {/* 입력창 */}
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  )
}
