/**
 * 매물 도메인 모델
 *
 * listing.ts, listingDetail.ts, listings.ts를 통합
 */

/**
 * 해방향 타입
 */
export type Direction = 'N' | 'S' | 'E' | 'W' | 'NE' | 'NW' | 'SE' | 'SW'

/**
 * 건물 타입
 */
export type BuildingType = 'ROOM' | 'APARTMENT' | 'HOUSE' | 'OFFICETEL'

/**
 * 경매 타입
 */
export type AuctionType = 'all' | 'auction' | 'normal'

/**
 * API 응답 wrapper 타입
 */
export interface ApiResponse<T> {
  data: T
  message: string
  status: number
  timestamp: number
}

/**
 * 매물 리스트 아이템 타입 (지도, 목록용)
 */
export interface ListingData {
  propertySeq: number
  address: string
  propertyNm: string
  latitude: number
  longitude: number
  area: number
  areaP: number
  deposit: number
  mnRent: number
  fee: number
  // 필터링을 위한 추가 필드
  buildingType?: BuildingType
  roomCnt?: string
  floor?: string
  facing?: Direction
  isAucPref?: boolean
}

/**
 * 매물 상세 데이터 타입 (상세 페이지용)
 */
export interface ListingDetailData {
  propertySeq: number
  lessorNm: string
  propertyNm: string
  content: string
  address: string
  latitude: number
  longitude: number
  buildingType: BuildingType
  area: number
  areaP: number
  deposit: number
  mnRent: number
  fee: number
  images: string[]
  period: string
  floor: string
  facing: Direction
  roomCnt: string
  bathroomCnt: string
  constructionDate: string
  parkingCnt: string
  hasElevator: boolean
  petAvailable: boolean
  isAucPref: boolean
  isBrkPref: boolean
  isLinked: boolean
  aucAt: string
  aucAvailable: string
}

/**
 * 매물 등록 - 기본 정보
 */
export interface ListingFormInfo {
  lessorNm: string
  propertyNm: string
  content: string
  area: string
  areaP: string
  deposit: string
  mnRent: string
  fee: string
  period: string
  floor: string
  facing: string
  roomCnt: string
  bathroomCnt: string
  images: File[]
}

/**
 * 매물 등록 - 추가 정보
 */
export interface ListingAdditionalInfo {
  constructionDate: string
  parkingCnt: string
  hasElevator: boolean
  petAvailable: boolean
  isAucPref: boolean
  isBrkPref: boolean
  aucAt: string
  aucAvailable: string
  notes: string
}

/**
 * 내 매물 (My Listings)
 */
export interface MyListing {
  propertySeq: number
  address: string
  detailAddress: string | null
  deposit: number
  mnRent: number
  isAucPref: boolean
  buildingType: BuildingType
  roomCnt: number
  connectBroker: string | null // 중개 성사여부 (pending, success, fail)
}
