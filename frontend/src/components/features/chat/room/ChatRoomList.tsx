'use client'

import { Trash2 } from 'lucide-react'
import React, { useState } from 'react'

import { useLeaveChatRoom } from '@/queries/useChat'
import { ChatRoomListResponseData } from '@/types/api/chat'

import ChatRoomCard from './ChatRoomCard'

interface ChatRoomListProps {
  className?: string
  chatRooms: ChatRoomListResponseData[] | null | undefined
  onDeleteRoom?: (roomSeq: number) => void
}

interface SwipeableItemProps {
  children: React.ReactNode
  onDelete: () => void
}

function SwipeableItem({ children, onDelete }: SwipeableItemProps) {
  const [startX, setStartX] = useState(0)
  const [currentX, setCurrentX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [translateX, setTranslateX] = useState(0)
  const [hasSwiped, setHasSwiped] = useState(false)

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX)
    setIsDragging(true)
    setHasSwiped(false)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return

    const currentPosition = e.touches[0].clientX
    const diff = currentPosition - startX

    // 왼쪽으로만 드래그 가능하고, 최대 80px까지만
    if (diff < 0) {
      setCurrentX(Math.max(diff, -80))
      if (Math.abs(diff) > 5) {
        setHasSwiped(true)
      }
    } else {
      setCurrentX(0)
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)

    // 40px 이상 드래그하면 삭제 버튼 노출 상태 유지
    if (currentX < -40) {
      setTranslateX(-80)
    } else {
      setTranslateX(0)
    }
    setCurrentX(0)
  }

  const handleDelete = () => {
    onDelete()
    setTranslateX(0)
  }

  const handleCardClick = (e: React.MouseEvent) => {
    // 삭제 버튼이 노출된 상태에서 카드를 클릭하면 닫기
    if (translateX < 0) {
      e.preventDefault()
      e.stopPropagation()
      setTranslateX(0)
    }
    // 스와이프한 경우 링크 클릭 방지
    if (hasSwiped) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  return (
    <div className="relative overflow-hidden">
      {/* 삭제 버튼 (뒤에 숨어있음) */}
      <div className="absolute top-0.5 right-0 bottom-0.5 flex w-20 items-center justify-center bg-red-500">
        <button
          onClick={handleDelete}
          className="flex h-full w-full items-center justify-center p-3 text-white hover:bg-red-600"
          aria-label="채팅방 나가기"
        >
          <Trash2 size={24} />
        </button>
      </div>

      {/* 스와이프 가능한 카드 */}
      <div
        className="bg-white transition-transform duration-200 ease-out"
        style={{
          transform: `translateX(${isDragging ? currentX : translateX}px)`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleCardClick}
      >
        {children}
      </div>
    </div>
  )
}

export default function ChatRoomList({ chatRooms, className, onDeleteRoom }: ChatRoomListProps) {
  const { mutate: leaveChatRoom, isPending } = useLeaveChatRoom()

  const handleDelete = (roomSeq: number) => {
    if (onDeleteRoom) {
      onDeleteRoom(roomSeq)
    } else {
      // 기본 동작: 채팅방 나가기 Mutation 실행
      if (isPending) {
        console.log('채팅방 나가기 처리 중...')
        return
      }
      leaveChatRoom(roomSeq)
      console.log('채팅방 나가기:', roomSeq)
    }
  }

  return (
    <div className={`flex flex-col ${className ?? ''}`}>
      {chatRooms?.map(chatRoom => (
        <SwipeableItem key={chatRoom.roomSeq} onDelete={() => handleDelete(chatRoom.roomSeq)}>
          <ChatRoomCard chatRoom={chatRoom} />
        </SwipeableItem>
      ))}
    </div>
  )
}
