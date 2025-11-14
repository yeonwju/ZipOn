'use client'

import { Suspense } from 'react'

import { AuthGuard } from '@/components/auth'
import ChatListContent from '@/components/features/chat/room/ChatListContent'
import { ChatListSkeleton } from '@/components/skeleton/chat'

interface ChatPageClientProps {
  authToken: string | null
}

/**
 * 채팅 목록 페이지 Client Component
 * 
 * 보호 레벨:
 * 1차: Middleware (토큰 체크)
 * 2차: AuthGuard (사용자 정보 확인, React Query 캐싱)
 */
export default function ChatPageClient({ authToken }: ChatPageClientProps) {
  return (
    <AuthGuard>
      <Suspense fallback={<ChatListSkeleton />}>
        <ChatListContent authToken={authToken} />
      </Suspense>
    </AuthGuard>
  )
}

