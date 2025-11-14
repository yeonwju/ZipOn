/**
 * WebSocket 관련 타입 정의
 */

/**
 * 서버에서 내려주는 채팅 메시지
 */
export interface ChatMessage {
  messageSeq: number
  roomSeq: number
  sender: {
    userSeq: number
    name: string
    nickname: string
    profileImg: string
  }
  content: string
  sentAt: string
}

/**
 * 서버로 보내는 메시지 (ChatMessageRequestDto)
 */
export interface ChatMessageRequest {
  content: string
  type?: string
}

/**
 * 채팅 알림 메시지
 */
export interface ChatNotification {
  roomSeq: number
  sender: {
    userSeq: number
    name: string
    nickname: string
    profileImg: string
  }
  content: string
  sentAt: string
  unreadCount: number
}

