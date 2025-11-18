import { API_ENDPOINTS } from '@/constants'
import { authFetch } from '@/lib/fetch'
import {
  ChatRoomHistoryResponse,
  ChatRoomHistoryResponseData,
  ChatRoomListResponse,
  ChatRoomListResponseData,
  CreateChatRoomResponse,
  CreateChatRoomResponseData,
  LeaveChatRoomResponse,
} from '@/types/api/chat'

/**
 * 채팅방 생성
 */
export async function createChatRoom(propertySeq: number, isAucPref: boolean) {
  return authFetch.post<CreateChatRoomResponse>(API_ENDPOINTS.CREATE_CHAT, {
    propertySeq,
    isAucPref,
  })
}

/**
 * 채팅방 히스토리 조회
 */
export async function getChatRoomHistory(roomSeq: number) {
  return authFetch.get<ChatRoomHistoryResponse>(API_ENDPOINTS.CHAT_ROOM_HISTORY(roomSeq))
}

/**
 * 채팅방 목록 조회
 */
export async function getChatRoomList() {
  return authFetch.get<ChatRoomListResponse>(API_ENDPOINTS.CHAT_ROOM_LIST)
}

/**
 * 채팅방 나가기
 */
export async function leaveChatRoom(roomId: number) {
  return authFetch.delete<LeaveChatRoomResponse>(API_ENDPOINTS.CHAT_ROOM_LEAVE(roomId))
}
