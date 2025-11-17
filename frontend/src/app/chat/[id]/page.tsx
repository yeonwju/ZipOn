import { cookies } from 'next/headers'

import ChatRoomPageClient from './ChatRoomPageClient'

/**
 * 채팅방 페이지 (Server Component - Wrapper)
 * 
 * Server Component에서 쿠키를 읽어서 클라이언트로 전달
 * 실제 인증은 ChatRoomPageClient의 AuthGuard에서 처리
 */
export default async function ChatPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('AT')?.value || null

  return <ChatRoomPageClient authToken={token} />
}
