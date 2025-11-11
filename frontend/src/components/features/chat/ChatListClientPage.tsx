'use client'

import ChatRoomList from '@/components/features/chat/room/ChatRoomList'
import { chatRoomListDummy } from '@/data/ChatRoomListDummy'

export default function ChatListClientPage() {
  const dummyData = chatRoomListDummy

  return <ChatRoomList chatRooms={dummyData} />
}
