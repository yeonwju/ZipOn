import { API_ENDPOINTS } from '@/constants'
import { authFetch } from '@/lib/fetch'
import {
  BrokerInfo,
  GetBrokerListResponseDTO,
  RequestBrokerResponseDTO,
  SelectBrokerResponseDTO,
} from '@/types/api/broker'

export async function getBrokerList(
  propertySeq: number
): Promise<{ success: true; data: BrokerInfo[] } | { success: false; message?: string }> {
  try {
    const result = await authFetch.get<GetBrokerListResponseDTO>(
      API_ENDPOINTS.REQUEST_BORKER_LIST(propertySeq)
    )

    if (result.data) {
      console.log(' === Broker List === ')
      console.log(' === 매물 번호 ', propertySeq)
      console.log(' === Broker List === ', result.data)
      return { success: true, data: result.data.content }
    } else {
      console.log('=== Broker List X ===')
      return {
        success: false,
        message: '신청 브로커 리스트 찾을 수 없습니다.',
      }
    }
  } catch (error) {
    console.error('=== 신청 브로커 리스트 조회 중 에러 발생 ===')
    console.error('에러:', error)
    const errorMessage =
      error instanceof Error ? error.message : '신청 브로커 리스트 조회에 실패했습니다.'

    return {
      success: false,
      message: errorMessage,
    }
  }
}

export async function selectBroker(
  auctionSeq: number
): Promise<{ success: true; message: string } | { success: false; message: string }> {
  try {
    const result = await authFetch.post<SelectBrokerResponseDTO>(
      API_ENDPOINTS.SELECT_BROKER(auctionSeq)
    )
    if (result.status === 200) {
      return {
        success: true,
        message: result.message,
      }
    } else {
      return {
        success: false,
        message: result.message,
      }
    }
  } catch (error) {
    console.log('=== 중개인 선택 에러 ===')
    const errorMessage = error instanceof Error ? error.message : '브로커 선택에 실패했습니다.'

    return {
      success: false,
      message: errorMessage,
    }
  }
}

export async function RequestBroker(
  propertySeq: number,
  request: { strmDate: string; strmStartTm: string; strmEndTm: string; intro: string }
) {
  try {
    const result = await authFetch.post<RequestBrokerResponseDTO>(
      API_ENDPOINTS.REQUEST_BROKER(propertySeq),
      request
    )
    if (result.status === 200) {
      return {
        success: true,
        message: result.message,
      }
    } else {
      return {
        success: false,
      }
    }
  } catch (error) {
    console.log('error', error)
    return {
      success: false,
      message: error,
    }
  }
}
