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

/**
 * 라이브 방송 가능 경매 리스트 조회
 */
export async function getCanLiveAuctionList() {
  return authFetch.get<ResponseM<LiveAuctionData>>(API_ENDPOINTS.CAN_LIVE_AUCTION)
}

/**
 * 라이브 시작
 */
export async function startLive({
  auctionSeq,
  title,
}: {
  auctionSeq: number
  title: string
}) {
  return authFetch.post<ResponseS<LiveStartData>>(API_ENDPOINTS.START_LIVE, {
    auctionSeq,
    title,
  })
}

/**
 * 상태 별 라이브 목록 조회
 */
export async function getLiveList({
  status,
  sortType,
}: {
  status: string
  sortType: string
}) {
  return authFetch.get<ResponseM<LiveListData>>(API_ENDPOINTS.LIVE_LIST(status, sortType))
}

/**
 * 라이브 방 입장 토큰 발급
 */
export async function getLiveEnterToken({
  liveSeq,
  isHost,
}: {
  liveSeq: number
  isHost: boolean
}) {
  return authFetch.post<ResponseS<LiveEnterTokenData>>(
    API_ENDPOINTS.LIVE_ENTER_TOKEN(liveSeq, isHost)
  )
}

/**
 * 라이브 좋아요
 */
export async function likeLive(liveSeq: number) {
  return authFetch.post<ResponseS<boolean>>(API_ENDPOINTS.LIVE_LIKE(liveSeq))
}

/**
 * 라이브 방송 퇴장
 */
export async function leaveLive(liveSeq: number) {
  return authFetch.post<{ status: number; message: string }>(API_ENDPOINTS.LIVE_EXIT(liveSeq))
}

/**
 * 라이브 방송 종료
 */
export async function endLive(liveSeq: number) {
  return authFetch.post<ResponseS<LiveEndData>>(API_ENDPOINTS.LIVE_END(liveSeq))
}

/**
 * 라이브 방송 정보 조회
 */
export async function searchLiveInfo(liveSeq: number) {
  return authFetch.get<ResponseS<LiveInfoData>>(API_ENDPOINTS.LIVE_INFO_SEARCH(liveSeq))
}

/**
 * 라이브 채팅 내역 조회
 */
export async function liveChatList(liveSeq: number) {
  return authFetch.get<ResponseM<LiveChatHistory>>(API_ENDPOINTS.LIVE_CHAT_HISTORY(liveSeq))
}
