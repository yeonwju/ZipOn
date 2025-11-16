/**
 * =========== 채팅방 생성 응답값 ===========================
 */
export interface CreateChatRoomResponseData {
  roomSeq: number
  isNew: boolean
  opponent: {
    userSeq: number
    name: string
    nickname: string
    profileImg: string
  }
}

export interface CreateChatRoomResponse {
  status: number
  message: string
  data: CreateChatRoomResponseData
}
/**
 * =================================================================
 */

/**
 * =========== 채팅방 채팅 목록 조회 응답값 ===========================
 */
export interface ChatRoomHistoryResponse {
  status: number
  message: string
  data: ChatRoomHistoryResponseData[]
}

export interface ChatRoomHistoryResponseData {
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
 * =================================================================
 */

/**
 * =========== 채팅방 목록 조회 응답값 ===========================
 */
export interface ChatRoomListResponse {
  status: number
  message: string
  data: ChatRoomListResponseData[]
}

export interface ChatRoomListResponseData {
  roomSeq: number
  partner: {
    userSeq: number
    name: string | null
    nickname: string | null
    profileImg: string | null
  } | null
  lastMessage: {
    content: string
    sentAt: string
  } | null
  unreadCount: number
}
/**
 * =================================================================
 */

/**
 * =========== 채팅방 나가기 응답값 ===========================
 */
export interface LeaveChatRoomResponse {
  status: number
  message: string
}
/**
 * =================================================================
 */
