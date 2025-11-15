import { API_ENDPOINTS } from '@/constants'
import { authFetch } from '@/lib/fetch'
import {
  LiveAuctionResponseData,
  LiveStartResponseData,
  ResponseM,
  ResponseS,
} from '@/types/api/live'

export async function getCanLiveAuctionList(): Promise<{
  success: boolean
  data: LiveAuctionResponseData[] | null
}> {
  try {
    const result = await authFetch.get<ResponseM<LiveAuctionResponseData>>(
      API_ENDPOINTS.CAN_LIVE_AUCTION
    )
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

export async function startLive({
  auctionSeq,
  title,
}: {
  auctionSeq: number
  title: string
}): Promise<{
  success: boolean
  data: LiveStartResponseData | null
}> {
  try {
    const result = await authFetch.post<ResponseS<LiveStartResponseData>>(
      API_ENDPOINTS.START_LIVE,
      { auctionSeq, title }
    )
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
