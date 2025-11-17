'use client'

import { useEffect, useRef } from 'react'

export interface ChatMessage {
  id: string
  userName: string
  message: string
  timestamp: Date
  isHost?: boolean
}

interface LiveChatListProps {
  messages: ChatMessage[]
}

/**
 * 라이브 채팅 목록
 * - 실시간 채팅 메시지 표시
 * - 자동 스크롤
 * - 진행자 메시지 강조
 */
export default function LiveChatList({ messages }: LiveChatListProps) {
  const chatEndRef = useRef<HTMLDivElement>(null)

  // 새 메시지가 오면 자동 스크롤
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-white/60">첫 번째 메시지를 보내보세요!</p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col gap-2 overflow-y-auto bg-black/50 px-3 py-2 backdrop-blur-md transition-all">
      {messages.map(msg => (
        <div
          key={msg.id}
          className={`flex flex-col gap-0.5 rounded-lg px-3 py-2 backdrop-blur-sm ${
            msg.isHost ? 'border border-blue-400/50 bg-blue-500/30' : 'bg-black/30'
          }`}
        >
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-semibold ${msg.isHost ? 'text-blue-300' : 'text-white/90'}`}
            >
              {msg.userName}
            </span>
            {msg.isHost && (
              <span className="rounded bg-blue-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                진행자
              </span>
            )}
          </div>
          <p className="text-sm text-white">{msg.message}</p>
        </div>
      ))}
      <div ref={chatEndRef} />
    </div>
  )
}
