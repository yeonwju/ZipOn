import { API_ENDPOINTS } from '@/constants'
import { authFetch } from '@/lib/fetch'
import { ResponseM, ResponseS } from '@/types/api/live'

export async function bid(
  auctionSeq: number,
  amount: number
): Promise<{ success: boolean; message: string | unknown }> {
  try {
    const result = await authFetch.post<{ status: number; message: string }>(API_ENDPOINTS.BID, {
      auctionSeq,
      amount,
    })

    if (result.status === 200) {
      console.log('success : ', result.message)
      return { success: true, message: result.message }
    } else {
      console.log('fail : ', result.message)
      return { success: false, message: result.message }
    }
  } catch (error) {
    console.log('error : ', error)
    return { success: false, message: error }
  }
}

export async function bidAccept(
  auctionSeq: number
): Promise<{ success: boolean; message: string | unknown }> {
  try {
    const result = await authFetch.post<{ status: number; message: string }>(
      API_ENDPOINTS.BID_ACCEPT(auctionSeq)
    )

    if (result.status === 200) {
      console.log('success : ', result.message)
      return { success: true, message: result.message }
    } else {
      console.log('fail : ', result.message)
      return { success: false, message: result.message }
    }
  } catch (error) {
    console.log('error : ', error)
    return { success: false, message: error }
  }
}

export async function bidReject(
  auctionSeq: number
): Promise<{ success: boolean; data: number | null }> {
  try {
    const result = await authFetch.post<ResponseS<{ contractSeq: number }>>(
      API_ENDPOINTS.BID_REJECT(auctionSeq)
    )

    if (result.status === 200) {
      return { success: true, data: result.data?.contractSeq }
    } else {
      console.log('fail : ', result.message)
      return { success: false, data: result.data?.contractSeq }
    }
  } catch (error) {
    console.log('error : ', error)
    return { success: false, data: null }
  }
}
