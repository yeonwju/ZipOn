import { Suspense } from 'react'

import ChatListContent from '@/components/features/chat/room/ChatListContent'
import { ChatListSkeleton } from '@/components/skeleton/chat'

export const dynamic = 'force-dynamic'

export default function ChatPage() {
  return (
    <Suspense fallback={<ChatListSkeleton />}>
      <ChatListContent />
    </Suspense>
  )
}
