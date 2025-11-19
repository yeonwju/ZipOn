import { API_ENDPOINTS } from '@/constants'
import { authFetch } from '@/lib/fetch'
import {
  BrokerInfo,
  GetBrokerListResponseDTO,
  RequestBrokerResponseDTO,
  SelectBrokerResponseDTO,
} from '@/types/api/broker'

/**
 * 중개인 신청 목록 조회
 */
export async function getBrokerList(propertySeq: number) {
  return authFetch.get<GetBrokerListResponseDTO>(API_ENDPOINTS.REQUEST_BORKER_LIST(propertySeq))
}

/**
 * 중개인 선택
 */
export async function selectBroker(auctionSeq: number) {
  return authFetch.post<SelectBrokerResponseDTO>(API_ENDPOINTS.SELECT_BROKER(auctionSeq))
}

/**
 * 중개 신청
 */
export async function RequestBroker(
  propertySeq: number,
  request: {
    strmDate: string
    strmStartTm: string
    strmEndTm: string
    intro: string
    auctionEndAt: string
  }
) {
  return authFetch.post<RequestBrokerResponseDTO>(
    API_ENDPOINTS.REQUEST_BROKER(propertySeq),
    request
  )
}
