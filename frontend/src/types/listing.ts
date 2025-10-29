/**
 * 매물 관련 타입 정의
 */

/**
 * 매물 데이터 타입
 * @property id - 매물 고유 ID
 * @property name - 건물명
 * @property address - 건물 주소
 * @property lat - 위도 (latitude)
 * @property lng - 경도 (longitude)
 * @property deposit - 보증금 (단위: 만원)
 * @property rent - 월세 (단위: 만원)
 * @property isAuction - 경매 여부
 */
export type ListingData = {
  id: number
  name: string
  address: string
  lat: number
  lng: number
  deposit: number
  rent: number
  isAuction: boolean
}

/**
 * 필터 타입
 * - all: 전체 매물
 * - auction: 경매 매물만
 * - normal: 일반 매물만
 */
export type FilterType = 'all' | 'auction' | 'normal'
