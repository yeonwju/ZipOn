'use client'

import { Menu } from 'lucide-react'
import { useState } from 'react'

import SubHeader from '@/components/layout/header/SubHeader'
import type { ChatHistory } from '@/types'

import ChatInput from './ChatInput'
import ChatMessageList from './ChatMessageList'

interface ChatRoomProps {
  roomSeq: number
  partnerName: string
  partnerProfileImage?: string
  initialMessages: ChatHistory[]
  currentUserSeq: number
}
export default function ChatRoom({
  roomSeq,
  partnerName,
  partnerProfileImage = '/default-profile.svg',
  initialMessages,
  currentUserSeq,
}: ChatRoomProps) {
  const [messages, setMessages] = useState<ChatHistory[]>(initialMessages)

  const handleSendMessage = (content: string) => {
    // TODO: 실제로는 API 호출
    const newMessage: ChatHistory = {
      messageSeq: messages.length + 1,
      roomSeq,
      senderSeq: currentUserSeq,
      senderName: '나',
      content,
      sentAt: new Date().toISOString(),
    }

    setMessages([...messages, newMessage])
    console.log('메시지 전송:', content)
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
        messages={messages}
        currentUserSeq={currentUserSeq}
        partnerProfileImage={partnerProfileImage}
      />

      {/* 입력창 */}
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  )
}
