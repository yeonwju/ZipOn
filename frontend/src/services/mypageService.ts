// 라이브 방성 정보 조회
import { API_ENDPOINTS } from '@/constants'
import { authFetch } from '@/lib/fetch'
import { ResponseM } from '@/types/api/live'
import { MyAuctionsData, MyBrokerageData, MyPropertiesData } from '@/types/api/mypage'

// 나의 매물 내역 조회
export async function myPropertiseInfo():
  Promise<{ success: boolean; data: MyPropertiesData[] | null }> {
  try {
    const result = await authFetch.get<ResponseM<MyPropertiesData>>(
      API_ENDPOINTS.MYPAGE_PROPERTY
    )
    if (result.status === 200) {
      console.log('나의 매물 정보 : ', result.data)
      return { success: true, data: result.data }
    } else {
      console.log('나의 매물 정보 조회 실패 : ', result.message)
      return { success: false, data: null }
    }
  } catch (error) {
    console.log('나의 매물 정보 조회 오류 : ', error)
    return { success: false, data: null }
  }
}

// 나의 중개 내역 조회
export async function myBrokerageInfo():
  Promise<{ success: boolean; data: MyBrokerageData[] | null }> {
  try {
    const result = await authFetch.get<ResponseM<MyBrokerageData>>(
      API_ENDPOINTS.MYPAGE_BROKERAGE
    )
    if (result.status === 200) {
      console.log('나의 중개 정보 : ', result.data)
      return { success: true, data: result.data }
    } else {
      console.error('나의 중개 정보 조회 실패 : ', result.message)
      return { success: false, data: null }
    }
  } catch (error) {
    console.error('나의 중개 정보 조회 오류 : ', error)
    if (error instanceof Error) {
      console.error('에러 메시지:', error.message)
    }
    return { success: false, data: null }
  }
}

//나의 경매 참여 내역 조회
export async function myAuctionInfo():
  Promise<{ success: boolean; data: MyAuctionsData[] | null }> {
  try {
    const result = await authFetch.get<ResponseM<MyAuctionsData>>(
      API_ENDPOINTS.MYPAGE_AUCTION
    )
    if (result.status === 200) {
      console.log('나의 경매 참여 내역 정보 : ', result.data)
      return { success: true, data: result.data }
    } else {
      console.log('나의 경매 참여 내역 정보 조회 실패 : ', result.message)
      return { success: false, data: null }
    }
  } catch (error) {
    console.log('나의 경매 참여 내역 정보 조회 오류 : ', error)
    return { success: false, data: null }
  }
}