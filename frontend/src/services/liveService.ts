import { API_ENDPOINTS } from '@/constants'
import { authFetch } from '@/lib/fetch'
import {
  LiveAuctionData,
  LiveChatHistory,
  LiveEndData,
  LiveEnterTokenData,
  LiveInfoData,
  LiveListData,
  LiveStartData,
  ResponseM,
  ResponseS,
} from '@/types/api/live'

// 라이브 방송 가능 경매 리스트 조회
export async function getCanLiveAuctionList(): Promise<{
  success: boolean
  data: LiveAuctionData[] | null
}> {
  try {
    const result = await authFetch.get<ResponseM<LiveAuctionData>>(API_ENDPOINTS.CAN_LIVE_AUCTION)
    if (result.status === 200) {
      return { success: true, data: result.data }
    } else {
      console.error('라이브 가능한 경매 목록 조회 실패:', result.message)
      return { success: false, data: null }
    }
  } catch (error) {
    console.error('라이브 가능한 경매 목록 조회 실패:', error)
    return { success: false, data: null }
  }
}

// 라이브 시작
export async function startLive({
  auctionSeq,
  title,
}: {
  auctionSeq: number
  title: string
}): Promise<{
  success: boolean
  data: LiveStartData | null
}> {
  try {
    const result = await authFetch.post<ResponseS<LiveStartData>>(API_ENDPOINTS.START_LIVE, {
      auctionSeq,
      title,
    })
    if (result.status === 200 || result.status === 201) {
      console.log('라이브 방송 시작 성공:', result.data)
      return { success: true, data: result.data }
    } else {
      console.error('라이브 방송 시작 실패:', result.message)
      return { success: false, data: null }
    }
  } catch (error) {
    console.error('라이브 방송 시작 실패:', error)
    return { success: false, data: null }
  }
}

// 상태 별 라이브 목록 조회
export async function getLiveList({
  status,
  sortType,
}: {
  status: string
  sortType: string
}): Promise<{ success: boolean; data: LiveListData[] | null }> {
  try {
    const result = await authFetch.get<ResponseM<LiveListData>>(
      API_ENDPOINTS.LIVE_LIST(status, sortType)
    )

    if (result.status === 200 || result.status === 201) {
      console.log('라이브 방송 리스트', result.data)
      return { success: true, data: result.data }
    } else {
      console.error('라이브 리스트 가져오기 실패: ', result.message)
      return { success: false, data: null }
    }
  } catch (error) {
    console.error('라이브 리스트 가져오기 실패', error)
    return { success: false, data: null }
  }
}

// 라이브 방 입장 토큰 발급
export async function getLiveEnterToken({
  liveSeq,
  isHost,
}: {
  liveSeq: number
  isHost: boolean
}): Promise<{ success: boolean; data: LiveEnterTokenData | null }> {
  try {
    const result = await authFetch.post<ResponseS<LiveEnterTokenData>>(
      API_ENDPOINTS.LIVE_ENTER_TOKEN(liveSeq, isHost)
    )

    if (result.status === 200) {
      console.log('입장 토큰 발급 : ', result.data)
      return { success: true, data: result.data }
    } else {
      console.log('토큰 발급 실패 : ', result.message)
      return { success: false, data: null }
    }
  } catch (error) {
    console.error('토큰 발급 실패 : ', error)
    return { success: false, data: null }
  }
}

// 라이브 좋아요
export async function likeLive(liveSeq: number): Promise<{ success: boolean; data: boolean }> {
  try {
    const result = await authFetch.post<ResponseS<boolean>>(API_ENDPOINTS.LIVE_LIKE(liveSeq))
    if (result.status === 200) {
      console.log('좋아요 성공,취소 제대로 됨', result.data)
      return { success: true, data: result.data }
    } else {
      console.log('좋아요 성공,취소 제대로 안됨', result.message)
      return { success: false, data: false }
    }
  } catch (error) {
    console.error('좋아요 오류 : ', error)
    return { success: false, data: false }
  }
}

// 라이브 방송 퇴장
export async function leaveLive(liveSeq: number): Promise<{ success: boolean }> {
  try {
    const result = await authFetch.post<{ status: number; message: string }>(
      API_ENDPOINTS.LIVE_EXIT(liveSeq)
    )

    if (result.status === 200) {
      console.log('라이브 퇴장 성공')
      return { success: true }
    } else {
      console.log('라이브 퇴장 실패 : ', result.message)
      return { success: false }
    }
  } catch (error) {
    console.error('라이브 퇴장 오류 : ', error)
    return { success: false }
  }
}

// 라이브 방송 종료
export async function endLive(
  liveSeq: number
): Promise<{ success: boolean; data: LiveEndData | null }> {
  try {
    const result = await authFetch.post<ResponseS<LiveEndData>>(API_ENDPOINTS.LIVE_END(liveSeq))
    if (result.status === 200) {
      console.log('방송 종료 성공: ', result.data)
      return { success: true, data: result.data }
    } else {
      console.log('방송 종료 실패 : ', result.message)
      return { success: false, data: null }
    }
  } catch (error) {
    console.log('방송 종료 오류 : ', error)
    return { success: false, data: null }
  }
}

// 라이브 방성 정보 조회
export async function searchLiveInfo(
  liveSeq: number
): Promise<{ success: boolean; data: LiveInfoData | null }> {
  try {
    const result = await authFetch.get<ResponseS<LiveInfoData>>(
      API_ENDPOINTS.LIVE_INFO_SEARCH(liveSeq)
    )
    if (result.status === 200) {
      console.log('방송 정보 : ', result.data)
      return { success: true, data: result.data }
    } else {
      console.log('방송 정보 조회 실패 : ', result.message)
      return { success: false, data: null }
    }
  } catch (error) {
    console.log('방송 정보 조회 오류 : ', error)
    return { success: false, data: null }
  }
}

// 라이브 채팅 내역 조회
export async function liveChatList(
  liveSeq: number
): Promise<{ success: boolean; data: LiveChatHistory[] | null }> {
  try {
    const result = await authFetch.get<ResponseM<LiveChatHistory>>(
      API_ENDPOINTS.LIVE_CHAT_HISTORY(liveSeq)
    )
    if (result.status === 200) {
      console.log('채팅 내역조회 성공 : ', result.data)
      return { success: true, data: result.data }
    } else {
      console.log('채팅 내역조회 실패 : ', result.message)
      return { success: false, data: null }
    }
  } catch (error) {
    console.log('채팅 내역조회 오류 : ', error)
    return { success: false, data: null }
  }
}
