'use client'

import ChatRoomList from '@/components/features/chat/room/ChatRoomList'
import { chatRoomListDummy } from '@/data/ChatRoomListDummy'

export default function ChatListContent() {
  // TODO: React Query useSuspenseQuery로 교체
  const dummyData = chatRoomListDummy

  return <ChatRoomList chatRooms={dummyData} />
}
