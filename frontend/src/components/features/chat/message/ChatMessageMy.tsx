import type { ChatHistory } from '@/types'

interface ChatMessageMyProps {
  message: ChatHistory
  showTime?: boolean
}

export default function ChatMessageMy({ message, showTime = true }: ChatMessageMyProps) {
  const formatTime = (isoString: string) => {
    const date = new Date(isoString)
    const hours = date.getHours()
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const ampm = hours < 12 ? '오전' : '오후'
    const displayHour = hours % 12 === 0 ? 12 : hours % 12
    return `${ampm} ${displayHour}:${minutes}`
  }

  return (
    <div className="flex items-end justify-end gap-1 px-4 py-1">
      {/* 시간 */}
      {showTime && (
        <div className="mb-1 text-xs text-gray-400">{formatTime(message.sentAt)}</div>
      )}

      {/* 메시지 말풍선 */}
      <div className="max-w-[70%] break-words rounded-2xl bg-yellow-300 px-3 py-2 text-sm">
        {message.content}
      </div>
    </div>
  )
}
