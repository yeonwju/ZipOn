import { API_ENDPOINTS } from '@/constants'
import { authFetch } from '@/lib/fetch'
import { ResponseM } from '@/types/api/live'
import { MyAuctionsData, MyBrokerageData, MyPropertiesData } from '@/types/api/mypage'

/**
 * 나의 매물 내역 조회
 */
export async function myPropertiseInfo() {
  return authFetch.get<ResponseM<MyPropertiesData>>(API_ENDPOINTS.MYPAGE_PROPERTY)
}

/**
 * 나의 중개 내역 조회
 */
export async function myBrokerageInfo() {
  return authFetch.get<ResponseM<MyBrokerageData>>(API_ENDPOINTS.MYPAGE_BROKERAGE)
}

/**
 * 나의 경매 참여 내역 조회
 */
export async function myAuctionInfo() {
  return authFetch.get<ResponseM<MyAuctionsData>>(API_ENDPOINTS.MYPAGE_AUCTION)
}