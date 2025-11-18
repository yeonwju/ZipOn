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
import { authFetch } from '@/lib/fetch'
import {
  ListingAuctions,
  ListingDetailDataResponse,
  ListingDetailResponse,
  ListingsRegVerifyResponse,
  RegListingRequest,
  RegListingResponse,
} from '@/types/api/listings'
import { ResponseS } from '@/types/api/live'
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
  // 클라이언트 사이드 검증
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

  return authFetch.post<ListingsRegVerifyResponse>(API_ENDPOINTS.LISTINGS_REG_VERIFY, formData)
}

/**
 * 매물 등록 상세정보
 */
export async function createListing(request: RegListingRequest) {
  const formData = new FormData()

  formData.append('req', request.req)

  request.images.forEach(file => {
    formData.append('images', file)
  })

  return authFetch.post<RegListingResponse>(API_ENDPOINTS.LISTINGS_CREATE, formData)
}

/**
 * 매물 상세 정보 조회
 *
 * @param seq - 매물 Seq
 * @returns 매물 상세 정보
 */
export async function getListingDetail(seq: number) {
  return authFetch.get<ListingDetailResponse>(API_ENDPOINTS.LISTINGS_DETAIL(seq))
}

/**
 * 경매 매물 목록 조회
 */
export async function getAuctionListings() {
  console.log('[listingService] 경매 매물 목록 조회 시작:', API_ENDPOINTS.LISTINGS_AUCTION)
  const response = await authFetch.get<ResponseS<ListingAuctions>>(API_ENDPOINTS.LISTINGS_AUCTION)
  console.log('[listingService] 경매 매물 목록 응답:', {
    hasData: !!response.data,
    itemsCount: response.data?.items?.length || 0,
    items: response.data?.items?.map(item => ({
      propertySeq: item.propertySeq,
      title: item.title,
      thumbnail: item.thumbnail,
      thumbnailType: typeof item.thumbnail,
    })),
  })
  return response
}

/**
 * 일반 매물 목록 조회
 */
export async function getGeneralListings() {
  console.log('[listingService] 일반 매물 목록 조회 시작:', API_ENDPOINTS.LISTINGS_GENERAL)
  const response = await authFetch.get<ResponseS<ListingAuctions>>(API_ENDPOINTS.LISTINGS_GENERAL)
  console.log('[listingService] 일반 매물 목록 응답:', {
    hasData: !!response.data,
    itemsCount: response.data?.items?.length || 0,
    items: response.data?.items?.map(item => ({
      propertySeq: item.propertySeq,
      title: item.title,
      thumbnail: item.thumbnail,
      thumbnailType: typeof item.thumbnail,
    })),
  })
  return response
}

/**
 * 중개 매물 목록 조회
 */
export async function getBrkListings() {
  console.log('[listingService] 중개 매물 목록 조회 시작:', API_ENDPOINTS.LISTINGS_BRK)
  const response = await authFetch.get<ResponseS<ListingAuctions>>(API_ENDPOINTS.LISTINGS_BRK)
  console.log('[listingService] 중개 매물 목록 응답:', {
    hasData: !!response.data,
    itemsCount: response.data?.items?.length || 0,
    items: response.data?.items?.map(item => ({
      propertySeq: item.propertySeq,
      title: item.title,
      thumbnail: item.thumbnail,
      thumbnailType: typeof item.thumbnail,
    })),
  })
  return response
}

/**
 * 매물 삭제
 */
export async function deleteListing(propertySeq: number) {
  return authFetch.delete<ResponseS<string>>(API_ENDPOINTS.LISTINGS_DELETE(propertySeq))
}

/**
 * 매물 목록 가져오기
 *
 * 현재는 샘플 데이터를 반환하지만, 실제 API 연동 시 이 함수만 수정하면 됩니다.
 *
 * @returns 매물 목록 배열
 */
export async function getListingsMap(): Promise<ListingData[]> {
  return Promise.resolve(BuildingData)
}
