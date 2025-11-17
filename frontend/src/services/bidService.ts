import { API_ENDPOINTS } from '@/constants'
import { authFetch } from '@/lib/fetch'
import { ResponseS } from '@/types/api/live'

/**
 * 입찰하기
 */
export async function bid(auctionSeq: number, amount: number) {
  return authFetch.post<{ status: number; message: string }>(API_ENDPOINTS.BID, {
    auctionSeq,
    amount,
  })
}

/**
 * 입찰 수락
 */
export async function bidAccept(auctionSeq: number) {
  return authFetch.post<{ status: number; message: string }>(API_ENDPOINTS.BID_ACCEPT(auctionSeq))
}

/**
 * 입찰 거절
 */
export async function bidReject(auctionSeq: number) {
  return authFetch.post<ResponseS<{ contractSeq: number }>>(API_ENDPOINTS.BID_REJECT(auctionSeq))
}
