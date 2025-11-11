'use client'

import { Suspense } from 'react'

import { AuthGuard } from '@/components/auth'
import ChatRoomContent from '@/components/features/chat/room/ChatRoomContent'
import { ChatRoomSkeleton } from '@/components/skeleton/chat'

/**
 * 채팅방 페이지 Client Component
 * 
 * 보호 레벨:
 * 1차: Middleware (토큰 체크)
 * 2차: AuthGuard (사용자 정보 확인, React Query 캐싱)
 */
export default function ChatRoomPageClient() {
  return (
    <AuthGuard>
      <Suspense fallback={<ChatRoomSkeleton />}>
        <ChatRoomContent />
      </Suspense>
    </AuthGuard>
  )
}

