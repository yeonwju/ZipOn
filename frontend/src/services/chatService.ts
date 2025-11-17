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

export async function createChatRoom(
  propertySeq: number,
  isAucPref: boolean
): Promise<{
  success: boolean
  data: CreateChatRoomResponseData | null
}> {
  try {
    const result = await authFetch.post<CreateChatRoomResponse>(API_ENDPOINTS.CREATE_CHAT, {
      propertySeq,
      isAucPref,
    })
    if (result.status === 200) {
      console.log('방생성 성공:', result.data)
      return { success: true, data: result.data }
    } else {
      console.error('방생성 실패:', result.data)
      return { success: false, data: null }
    }
  } catch (error) {
    console.error('방생성 실패:', error)
    return { success: false, data: null }
  }
}

export async function getChatRoomHistory(roomSeq: number): Promise<{
  success: boolean
  data: ChatRoomHistoryResponseData[] | null
}> {
  try {
    const result = await authFetch.get<ChatRoomHistoryResponse>(
      API_ENDPOINTS.CHAT_ROOM_HISTORY(roomSeq)
    )
    if (result.status === 200) {
      console.log('채팅방 조회 성공:', result.data)
      return { success: true, data: result.data }
    } else {
      console.error('채팅방 조회 실패:', result.data)
      return { success: false, data: null }
    }
  } catch (error) {
    console.error('채팅방 조회 실패:', error)
    return { success: false, data: null }
  }
}

export async function getChatRoomList(): Promise<{
  success: boolean
  data: ChatRoomListResponseData[] | null
}> {
  try {
    const result = await authFetch.get<ChatRoomListResponse>(API_ENDPOINTS.CHAT_ROOM_LIST)
    if (result.status === 200) {
      return {
        success: true,
        data: result.data,
      }
    } else {
      return {
        success: false,
        data: null,
      }
    }
  } catch (error) {
    console.error('채팅방 목록 조회 실패:', error)
    return { success: false, data: null }
  }
}

export async function leaveChatRoom(roomId: number): Promise<{ success: boolean }> {
  try {
    const result = await authFetch.delete<LeaveChatRoomResponse>(
      API_ENDPOINTS.CHAT_ROOM_LEAVE(roomId)
    )

    if (result.status === 200) {
      console.log('채팅방 나가기 성공')
      return { success: true }
    } else {
      console.error('채팅방 나가기 실패:')
      return { success: false }
    }
  } catch (error) {
    console.error('채팅방 나가기 실패:', error)
    return { success: false }
  }
}
