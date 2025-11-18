'use client'

import { Send } from 'lucide-react'
import { useState } from 'react'

interface LiveChatInputProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
}

/**
 * 라이브 채팅 입력창
 * - 메시지 입력
 * - 전송 버튼
 */
export default function LiveChatInput({ onSendMessage, disabled }: LiveChatInputProps) {
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const trimmedMessage = message.trim()
    if (trimmedMessage && !disabled) {
      onSendMessage(trimmedMessage)
      setMessage('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 px-3 py-2">
      <input
        type="text"
        value={message}
        onChange={e => setMessage(e.target.value)}
        placeholder="메시지를 입력하세요..."
        disabled={disabled}
        className="flex-1 rounded-full bg-black/40 px-4 py-2 text-base text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50"
        maxLength={200}
      />
      <button
        type="submit"
        disabled={!message.trim() || disabled}
        className="flex items-center justify-center rounded-full bg-blue-500 p-2 text-white transition-all hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="메시지 전송"
      >
        <Send size={20} />
      </button>
    </form>
  )
}

