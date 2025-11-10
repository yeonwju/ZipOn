import { Suspense } from 'react'

import ChatRoomContent from '@/components/features/chat/ChatRoomContent'
import { ChatRoomSkeleton } from '@/components/skeleton/chat'

export default function ChatPage() {
  return (
    <Suspense fallback={<ChatRoomSkeleton />}>
      <ChatRoomContent />
    </Suspense>
  )
}
