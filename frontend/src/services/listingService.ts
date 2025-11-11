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

import { BuildingData } from '@/data/BuildingDummy'
import { getListingDetailBySeq } from '@/data/ListingDetailDummy'
import type { ListingData, ListingDetailData } from '@/types/models/listing'

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

/**
 * 특정 매물 상세 정보 가져오기
 *
 * @param seq - 매물 Seq (1-100)
 * @returns 매물 상세 정보 (없으면 null)
 */
export async function getListingDetail(seq: number): Promise<ListingDetailData | null> {
  // TODO: 실제 API 연동 시 아래 코드로 교체
  // try {
  //   const response = await fetch(`/api/listings/${seq}`)
  //   if (!response.ok) {
  //     return null
  //   }
  //   const data = await response.json()
  //   return data.data // API 응답에서 data 필드 추출
  // } catch (error) {
  //   console.error('Failed to fetch listing:', error)
  //   return null
  // }

  // 현재는 더미 데이터 반환
  return Promise.resolve(getListingDetailBySeq(seq))
}

