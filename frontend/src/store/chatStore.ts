import { create } from 'zustand'

import { ChatRoomHistoryResponseData } from '@/types/api/chat'

interface ChatRoomMessages {
  messages: ChatRoomHistoryResponseData[]
  lastUpdated: number
}

interface ChatState {
  // 채팅방별 메시지 저장 (roomSeq를 키로 사용하는 객체)
  roomMessages: Record<number, ChatRoomMessages>
  
  // 서버에서 받은 메시지로 초기화 (채팅방 진입 시)
  setMessages: (roomSeq: number, messages: ChatRoomHistoryResponseData[]) => void
  
  // WebSocket으로 받은 새 메시지 추가
  addMessage: (roomSeq: number, message: ChatRoomHistoryResponseData) => void
  
  // 특정 채팅방 메시지 초기화
  clearRoomMessages: (roomSeq: number) => void
  
  // 모든 메시지 초기화
  clearAllMessages: () => void
}

export const useChatStore = create<ChatState>(set => ({
  roomMessages: {},

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
          return {
            roomMessages: {
              ...state.roomMessages,
              [roomSeq]: {
                messages: [...roomData.messages, message],
                lastUpdated: Date.now(),
              },
            },
          }
        }
        return state // 중복이면 변경 없음
      }

      // 채팅방 데이터가 없으면 새로 생성
      return {
        roomMessages: {
          ...state.roomMessages,
          [roomSeq]: {
            messages: [message],
            lastUpdated: Date.now(),
          },
        },
      }
    })
  },

  clearRoomMessages: roomSeq => {
    set(state => {
      const { [roomSeq]: _, ...rest } = state.roomMessages
      return { roomMessages: rest }
    })
  },

  clearAllMessages: () => {
    set({ roomMessages: {} })
  },
}))
