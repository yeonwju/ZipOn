import { connectWS } from './connection'
import { StompClientState } from './state'
import { ChatMessageRequest } from './types'

/**
 * WebSocket 메시지 전송 (Publish)
 */

/**
 * 채팅 메시지 전송
 */
export async function sendChat(
  roomSeq: number,
  payload: ChatMessageRequest,
  authToken: string | null
): Promise<void> {
  const { stompClient } = StompClientState

  if (!authToken) {
    console.error('❌ 인증 토큰이 필요합니다.')
    return
  }

  // 연결이 안 되어 있으면 연결 시도
  if (!stompClient || !stompClient.connected) {
    console.log('⏳ STOMP 연결이 안 되어 있어 연결 시도 중...')
    try {
      await connectWS(authToken)
      console.log('✅ STOMP 연결 완료, 메시지 전송 진행')
    } catch (error) {
      console.error('❌ STOMP 연결 실패:', error)
      return
    }
  }

  // 재확인 (연결 후에도 확인)
  const currentClient = StompClientState.stompClient
  if (!currentClient || !currentClient.connected) {
    console.error('❌ STOMP 연결할 수 없습니다.')
    return
  }

  // 헤더에 Authorization 추가
  const headers: Record<string, string> = {
    Authorization: `Bearer ${authToken}`,
  }

  // ChatMessageRequestDto 형식으로 변환 (content만 전송)
  const requestPayload = {
    content: payload.content,
  }

  try {
    currentClient.publish({
      destination: `/pub/chat/${roomSeq}`,
      body: JSON.stringify(requestPayload),
      headers,
    })

    console.log(`📤 메시지 전송 성공: /pub/chat/${roomSeq}`, requestPayload)
  } catch (error) {
    console.error('❌ 메시지 전송 실패:', error)
  }
}
