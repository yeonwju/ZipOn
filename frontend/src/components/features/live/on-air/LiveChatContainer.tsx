'use client'

import { MessageCircle, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import LiveChatInput from './LiveChatInput'
import LiveChatList, { ChatMessage } from './LiveChatList'
import LiveEndButton from './LiveEndButton'

interface LiveChatContainerProps {
  isHost?: boolean
  userName: string
}

/**
 * 라이브 채팅 컨테이너
 * - 채팅 목록 + 입력창
 * - 상태 관리
 * - 열기/닫기 기능
 */
export default function LiveChatContainer({ isHost, userName }: LiveChatContainerProps) {
  const [isOpen, setIsOpen] = useState(true)
  const router = useRouter()
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      userName: '홍길동',
      message: '안녕하세요! 방송 잘 보고 있습니다 👋',
      timestamp: new Date(),
      isHost: false,
    },
    {
      id: '2',
      userName: '김철수',
      message: '오늘 매물 정말 좋네요!',
      timestamp: new Date(),
      isHost: false,
    },
  ])
  // 뒤로 가기
  const handleGoBack = () => {
    router.back()
  }
  const handleEndBroadcast = () => {
    // TODO: 방송 종료 API 호출
    alert('방송이 종료되었습니다.')
    router.push('/live')
  }

  const handleSendMessage = (message: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      userName,
      message,
      timestamp: new Date(),
      isHost,
    }

    setMessages(prev => [...prev, newMessage])
  }

  // 채팅이 닫혀있으면 토글 버튼만 표시
  if (!isOpen) {
    return (
      <div className={'absolute bottom-4 z-10 flex w-full flex-row justify-between px-2'}>
        <div>
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 rounded-full bg-black/60 px-4 py-2.5 text-white backdrop-blur-sm transition-all hover:bg-black/80"
          >
            <MessageCircle size={20} />
            <span className="text-sm font-medium">채팅 열기</span>
            {messages.length > 0 && (
              <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold">
                {messages.length}
              </span>
            )}
          </button>
        </div>
        {isHost && (
          <div>
            <LiveEndButton onEnd={handleEndBroadcast} />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="absolute right-0 bottom-0 left-0 z-10 flex h-[45%] flex-col">
      {/* 채팅 헤더 */}
      <div className="flex items-center justify-between bg-black/60 px-3 py-2 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <MessageCircle size={18} className="text-white" />
          <span className="text-sm font-semibold text-white">
            채팅 {messages.length > 0 && `(${messages.length})`}
          </span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="rounded-full p-1 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="채팅 닫기"
        >
          <X size={18} />
        </button>
      </div>

      {/* 채팅 목록 (스크롤 가능) */}
      <div className="flex-1 overflow-hidden">
        <LiveChatList messages={messages} />
      </div>

      {/* 채팅 입력창 */}
      <div className="bg-gradient-to-t from-black/20 to-transparent backdrop-blur-sm">
        <LiveChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  )
}
