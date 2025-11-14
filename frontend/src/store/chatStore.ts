import { create } from 'zustand'

import { ChatRoomHistoryResponseData } from '@/types/api/chat'

interface ChatRoomMessages {
  messages: ChatRoomHistoryResponseData[]
  lastUpdated: number
}

interface LastMessageInfo {
  content: string
  sentAt: string
  sender: {
    userSeq: number
    name: string
    nickname: string
    profileImg: string
  }
  unreadCount: number
}

interface ChatState {
  // 채팅방별 메시지 저장 (roomSeq를 키로 사용하는 객체)
  roomMessages: Record<number, ChatRoomMessages>
  
  // 채팅방별 마지막 메시지 정보 (채팅 목록 표시용)
  lastMessages: Record<number, LastMessageInfo>
  
  // 서버에서 받은 메시지로 초기화 (채팅방 진입 시)
  setMessages: (roomSeq: number, messages: ChatRoomHistoryResponseData[]) => void
  
  // WebSocket으로 받은 새 메시지 추가
  addMessage: (roomSeq: number, message: ChatRoomHistoryResponseData) => void
  
  // 마지막 메시지 정보 업데이트 (알림 수신 시)
  updateLastMessage: (roomSeq: number, lastMessage: LastMessageInfo) => void
  
  // 특정 채팅방 메시지 초기화
  clearRoomMessages: (roomSeq: number) => void
  
  // 모든 메시지 초기화
  clearAllMessages: () => void
}

export const useChatStore = create<ChatState>(set => ({
  roomMessages: {},
  lastMessages: {},

  setMessages: (roomSeq, messages) => {
    set(state => ({
      roomMessages: {
        ...state.roomMessages,
        [roomSeq]: {
          messages,
          lastUpdated: Date.now(),
        },
      },
    }))
  },

  addMessage: (roomSeq, message) => {
    set(state => {
      const roomData = state.roomMessages[roomSeq]

      if (roomData) {
        // 중복 체크
        const isDuplicate = roomData.messages.some(
          msg => msg.messageSeq === message.messageSeq
        )

        if (!isDuplicate) {
          // 마지막 메시지 정보도 업데이트
          const lastMessage: LastMessageInfo = {
            content: message.content,
            sentAt: message.sentAt,
            sender: message.sender,
            unreadCount: 0, // 메시지를 받으면 읽음 처리는 하지 않음
          }

          return {
            roomMessages: {
              ...state.roomMessages,
              [roomSeq]: {
                messages: [...roomData.messages, message],
                lastUpdated: Date.now(),
              },
            },
            lastMessages: {
              ...state.lastMessages,
              [roomSeq]: lastMessage,
            },
          }
        }
        return state // 중복이면 변경 없음
      }

      // 채팅방 데이터가 없으면 새로 생성
      const lastMessage: LastMessageInfo = {
        content: message.content,
        sentAt: message.sentAt,
        sender: message.sender,
        unreadCount: 0,
      }

      return {
        roomMessages: {
          ...state.roomMessages,
          [roomSeq]: {
            messages: [message],
            lastUpdated: Date.now(),
          },
        },
        lastMessages: {
          ...state.lastMessages,
          [roomSeq]: lastMessage,
        },
      }
    })
  },

  updateLastMessage: (roomSeq, lastMessage) => {
    set(state => ({
      lastMessages: {
        ...state.lastMessages,
        [roomSeq]: lastMessage,
      },
    }))
  },

  clearRoomMessages: roomSeq => {
    set(state => {
      const { [roomSeq]: _, ...restMessages } = state.roomMessages
      const { [roomSeq]: __, ...restLastMessages } = state.lastMessages
      return { roomMessages: restMessages, lastMessages: restLastMessages }
    })
  },

  clearAllMessages: () => {
    set({ roomMessages: {}, lastMessages: {} })
  },
}))
