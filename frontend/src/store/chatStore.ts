import { create } from 'zustand'

import type { ChatMessage } from '@/lib/socket'

interface ChatState {
  messages: ChatMessage[]
  addMessage: (msg: ChatMessage) => void
  resetMessages: () => void
}

export const useChatStore = create<ChatState>(set => ({
  // 현재 채팅방에서 수신한 메시지 목록
  messages: [],

  // 새 메시지 추가
  addMessage: msg =>
    set(state => ({
      messages: [...state.messages, msg],
    })),

  // 채팅방 나갈 때 초기화
  resetMessages: () => set({ messages: [] }),
}))
