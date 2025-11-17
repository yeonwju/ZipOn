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

/**
 * 라이브 방송 채팅 메시지 (서버에서 받음)
 */
export interface LiveChatMessage {
  liveSeq: number
  senderSeq: number
  senderName: string
  content: string
  sentAt: string
}

/**
 * 라이브 방송 통계 업데이트
 */
export interface LiveStatsUpdate {
  type: 'VIEWER_COUNT_UPDATE' | 'CHAT_COUNT_UPDATE' | 'LIKE_COUNT_UPDATE' | 'LIVE_ENDED'
  count?: number
}

/**
 * 라이브 방송 시작 알림
 */
export interface LiveStartNotification {
  liveSeq: number
  auctionSeq: number
  sessionId: string
  title: string
  thumbnail: string
  status: string
  host: {
    userSeq: number
    name: string
    profileImg: string
  }
  startAt: string
}

/**
 * 라이브 방송 채팅 요청 (서버로 보냄)
 */
export interface LiveChatMessageRequest {
  content: string
}

