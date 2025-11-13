import { API_ENDPOINTS } from '@/constants'
import { authFetch } from '@/lib/fetch'
import { BrokerInfo, GetBrokerListResponseDTO } from '@/types/api/broker'

export async function getBrokerList(
  propertySeq: number,
  pageable = {
    page: 0,
    size: 200,
    sort: 'strmDate',
  }
): Promise<{ success: true; data: BrokerInfo[] } | { success: false; message?: string }> {
  try {
    const result = await authFetch.get<GetBrokerListResponseDTO>(
      API_ENDPOINTS.REQUEST_BORKER_LIST(propertySeq, pageable)
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
