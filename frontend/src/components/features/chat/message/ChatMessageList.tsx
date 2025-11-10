'use client'

import { useEffect, useRef } from 'react'

import type { ChatHistory } from '@/types'

import ChatMessageMy from './ChatMessageMy'
import ChatMessageOther from './ChatMessageOther'

interface ChatMessageListProps {
  messages: ChatHistory[]
  currentUserSeq: number
  partnerProfileImage?: string
}

export default function ChatMessageList({
  messages,
  currentUserSeq,
  partnerProfileImage = '/default-profile.svg',
}: ChatMessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 메시지가 추가되면 자동으로 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // 날짜 구분선 표시 여부 확인
  const shouldShowDateDivider = (currentMessage: ChatHistory, prevMessage?: ChatHistory) => {
    if (!prevMessage) return true

    const currentDate = new Date(currentMessage.sentAt).toDateString()
    const prevDate = new Date(prevMessage.sentAt).toDateString()

    return currentDate !== prevDate
  }

  // 날짜 포맷팅
  const formatDate = (isoString: string) => {
    const date = new Date(isoString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const messageDate = date.toDateString()
    const todayDate = today.toDateString()
    const yesterdayDate = yesterday.toDateString()

    if (messageDate === todayDate) {
      return '오늘'
    } else if (messageDate === yesterdayDate) {
      return '어제'
    } else {
      return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
    }
  }

  // 프로필 이미지 표시 여부 (연속된 메시지인지 확인)
  const shouldShowProfile = (currentMessage: ChatHistory, prevMessage?: ChatHistory) => {
    if (!prevMessage) return true
    if (currentMessage.senderSeq === currentUserSeq) return false
    if (prevMessage.senderSeq !== currentMessage.senderSeq) return true

    // 같은 발신자의 연속 메시지
    const currentTime = new Date(currentMessage.sentAt).getTime()
    const prevTime = new Date(prevMessage.sentAt).getTime()
    const timeDiff = (currentTime - prevTime) / 1000 / 60 // 분 단위

    // 1분 이상 차이나면 프로필 표시
    return timeDiff > 1
  }

  // 시간 표시 여부 (같은 시간대의 연속 메시지는 마지막에만 시간 표시)
  const shouldShowTime = (currentMessage: ChatHistory, nextMessage?: ChatHistory) => {
    if (!nextMessage) return true
    if (currentMessage.senderSeq !== nextMessage.senderSeq) return true

    const currentMinute = new Date(currentMessage.sentAt).toISOString().slice(0, 16)
    const nextMinute = new Date(nextMessage.sentAt).toISOString().slice(0, 16)

    return currentMinute !== nextMinute
  }

  return (
    <div className="flex flex-1 flex-col gap-1 overflow-y-auto bg-blue-50 pb-4">
      {messages.map((message, index) => {
        const prevMessage = index > 0 ? messages[index - 1] : undefined
        const nextMessage = index < messages.length - 1 ? messages[index + 1] : undefined
        const isMyMessage = message.senderSeq === currentUserSeq

        return (
          <div key={message.messageSeq}>
            {/* 날짜 구분선 */}
            {shouldShowDateDivider(message, prevMessage) && (
              <div className="my-4 flex items-center justify-center">
                <div className="rounded-full bg-gray-400 px-3 py-1 text-xs text-white">
                  {formatDate(message.sentAt)}
                </div>
              </div>
            )}

            {/* 메시지 */}
            {isMyMessage ? (
              <ChatMessageMy message={message} showTime={shouldShowTime(message, nextMessage)} />
            ) : (
              <ChatMessageOther
                message={message}
                showProfile={shouldShowProfile(message, prevMessage)}
                showTime={shouldShowTime(message, nextMessage)}
                profileImageSrc={partnerProfileImage}
              />
            )}
          </div>
        )
      })}

      {/* 스크롤 타겟 */}
      <div ref={messagesEndRef} />
    </div>
  )
}

