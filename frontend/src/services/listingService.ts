/**
 * 매물 데이터 서비스 레이어
 *
 * 이 파일은 매물 데이터의 소스를 중앙에서 관리합니다.
 * 샘플 데이터와 실제 API 데이터 간의 전환을 쉽게 할 수 있습니다.
 *
 * **데이터 소스 전환 방법:**
 * 1. 샘플 데이터 사용: `getListings()` 함수에서 `BuildingData` 반환
 * 2. API 데이터 사용: `getListings()` 함수에서 API 호출로 변경
 * 3. 하이브리드: 개발 중에는 샘플 데이터, 프로덕션에서는 API 데이터
 *
 * **사용 예시:**
 * ```tsx
 * // Server Component에서
 * import { getListings, getListingDetail } from '@/services/listingService'
 * const listings = await getListings()
 * const detail = await getListingDetail(1)
 * ```
 */

import { API_ENDPOINTS } from '@/constants'
import { BuildingData } from '@/data/BuildingDummy'
import { authFetch, publicFetch } from '@/lib/fetch'
import {
  ListingDetailDataResponse,
  ListingDetailResponse,
  ListingsRegVerifyResponse,
  RegListingRequest,
  RegListingResponse,
} from '@/types/api/listings'
import type { ListingData } from '@/types/models/listing'

/**
 * 매물 등록(등기부등본 인증)
 */
export async function registerListingVerification(request: {
  file: File
  regiNm: string | null | undefined
  regiBirth: string | null | undefined
  address: string
}) {
  try {
    console.log('=== 등기부등본 인증 요청 ===')
    console.log('파라미터 : ', request)

    if (!request.file) {
      throw new Error('파일은 필수입니다.')
    }
    if (!request.regiNm || request.regiNm.trim() === '') {
      throw new Error('등기명의인 이름은 필수입니다.')
    }
    if (!request.regiBirth || request.regiBirth.trim() === '') {
      throw new Error('등기명의인 생년월일은 필수입니다.')
    }
    if (!request.address || request.address.trim() === '') {
      throw new Error('주소는 필수입니다.')
    }

    const formData = new FormData()

    // 파일 단일 추가
    formData.append('file', request.file)

    // 문자열 필드 추가 (검증된 값만 추가)
    formData.append('regiNm', request.regiNm.trim())
    formData.append('regiBirth', request.regiBirth.trim())
    formData.append('address', request.address.trim())

    console.log('🚀 엔드포인트:', API_ENDPOINTS.LISTINGS_REG_VERIFY)
    for (const [key, value] of formData.entries()) {
      console.log(`  ${key}:`, value)
    }

    const result = await authFetch.post<ListingsRegVerifyResponse>(
      API_ENDPOINTS.LISTINGS_REG_VERIFY,
      formData
    )

    if (result.status === 200) {
      console.log('=== 등기부등본 인증 성공 ===')
      console.log('인증 데이터:', result.data)
      return {
        success: true,
        data: result.data,
      }
    } else {
      return {
        success: false,
      }
    }
  } catch (error) {
    // 네트워크 에러, 서버 에러 등의 예외 상황만 처리
    console.error('=== 등기부등본 인증 중 에러 발생 ===')
    console.error('에러', error)
    const errorMessage = error instanceof Error ? error.message : '등기부등본 인증에 실패했습니다.'

    return {
      success: false,
      message: errorMessage,
    }
  }
}

/**
 * 매물 등록 상세정보
 */
export async function createListing(request: RegListingRequest) {
  try {
    console.log('=== 매물 등록 요청 ===')
    console.log('이미지 개수:', request.images.length)

    const formData = new FormData()

    formData.append('req', request.req)

    request.images.forEach(file => {
      formData.append('images', file)
    })

    const result = await authFetch.post<RegListingResponse>(API_ENDPOINTS.LISTINGS_CREATE, formData)

    if (result.data && result.data.propertySeq) {
      console.log('=== 매물 등록 성공 ===')
      console.log('매물 번호:', result.data.propertySeq)
      return {
        success: true,
        data: result.data,
      }
    } else {
      console.warn('=== 매물 등록 실패 (data 없음) ===')
      return {
        success: false,
        message: '매물 등록 응답 데이터가 없습니다.',
      }
    }
  } catch (error) {
    console.error('=== 매물 등록 중 에러 발생 ===')
    console.error('에러:', error)
    const errorMessage = error instanceof Error ? error.message : '매물 등록에 실패했습니다.'

    return {
      success: false,
      message: errorMessage,
    }
  }
}

/**
 * 매물 상세 정보 조회
 *
 * @param seq - 매물 Seq
 * @returns 매물 상세 정보 (성공/실패 여부 포함)
 */
export async function getListingDetail(
  seq: number
): Promise<
  { success: true; data: ListingDetailDataResponse } | { success: false; message?: string }
> {
  try {
    const result = await authFetch.get<ListingDetailResponse>(API_ENDPOINTS.LISTINGS_DETAIL(seq))
    if (result.data) {
      console.log('=== 매물 상세정보 조회 성공 ===')
      console.log('=== 매물 번호 : ', seq)
      return {
        success: true,
        data: result.data,
      }
    } else {
      console.warn('=== 매물 상세정보 없음 ===')
      return {
        success: false,
        message: '매물 정보를 찾을 수 없습니다.',
      }
    }
  } catch (error) {
    console.error('=== 매물 상세조회 중 에러 발생 ===')
    console.error('에러:', error)
    const errorMessage = error instanceof Error ? error.message : '매물 상세조회에 실패했습니다.'

    return {
      success: false,
      message: errorMessage,
    }
  }
}

/**
 * 매물 목록 가져오기
 *
 * 현재는 샘플 데이터를 반환하지만, 실제 API 연동 시 이 함수만 수정하면 됩니다.
 *
 * @returns 매물 목록 배열
 */
export async function getListings(): Promise<ListingData[]> {
  // TODO: 실제 API 연동 시 아래 코드로 교체
  // try {
  //   const response = await fetch('/api/listings')
  //   if (!response.ok) {
  //     throw new Error('Failed to fetch listings')
  //   }
  //   const data = await response.json()
  //   return data.data // API 응답에서 data 필드 추출
  // } catch (error) {
  //   console.error('Failed to fetch listings:', error)
  //   // 에러 발생 시 샘플 데이터를 fallback으로 반환
  //   return BuildingData
  // }

  // 현재는 샘플 데이터 반환
  return Promise.resolve(BuildingData)
}

/**
 * 필터링된 매물 목록 가져오기
 *
 * 서버에서 필터링을 처리하고 싶을 때 사용합니다.
 * 클라이언트에서 필터링이 충분하다면 이 함수는 필요 없습니다.
 *
 * @param filters - 필터 옵션
 * @returns 필터링된 매물 목록 배열
 */
export async function getFilteredListings(filters?: {
  price?: { deposit?: { min?: number; max?: number }; rent?: { min?: number; max?: number } }
  roomCount?: number | '3+'
  area?: { min?: number; max?: number }
  floor?: number | 'B1' | '2+'
  direction?: 'east' | 'west' | 'south' | 'north' | 'northwest'
  buildingType?: 'ROOM' | 'APARTMENT' | 'HOUSE' | 'OFFICETEL'
  isAuction?: boolean
}): Promise<ListingData[]> {
  // TODO: 실제 API 연동 시 아래 코드로 교체
  // try {
  //   const response = await fetch('/api/listings', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ filters }),
  //   })
  //   if (!response.ok) {
  //     throw new Error('Failed to fetch filtered listings')
  //   }
  //   const data = await response.json()
  //   return data.listings
  // } catch (error) {
  //   console.error('Failed to fetch filtered listings:', error)
  //   return []
  // }

  // 현재는 전체 목록 반환 (필터링은 클라이언트에서 처리)
  return getListings()
}
