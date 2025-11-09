'use client'

import { Send } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  placeholder?: string
}

export default function ChatInput({
  onSendMessage,
  placeholder = '메시지를 입력하세요',
}: ChatInputProps) {
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      onSendMessage(message.trim())
      setMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-2 border-t border-gray-200 bg-white px-4 py-3 shadow-sm"
    >
      {/* 입력창 */}
      <textarea
        value={message}
        onChange={e => setMessage(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder={placeholder}
        className="max-h-24 min-h-[40px] flex-1 resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 focus:outline-none"
        rows={1}
      />

      {/* 전송 버튼 */}
      <Button
        type="submit"
        size="icon"
        className="h-10 w-10 flex-shrink-0 bg-yellow-400 hover:bg-yellow-500"
        disabled={!message.trim()}
      >
        <Send size={18} className="text-gray-700" />
      </Button>
    </form>
  )
}
