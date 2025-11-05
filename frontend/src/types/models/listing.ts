/**
 * 매물 도메인 모델
 *
 * listing.ts, listingDetail.ts, listings.ts를 통합
 */

/**
 * 해방향 타입
 */
export type Direction = 'east' | 'west' | 'south' | 'north'

/**
 * 건물 타입
 */
export type BuildingType = 'room' | 'apartment' | 'house' | 'officetel'

/**
 * 경매 타입
 */
export type AuctionType = 'all' | 'auction' | 'normal'

/**
 * 매물 데이터 타입
 */
export interface ListingData {
  id: number
  name: string
  address: string
  lat: number
  lng: number
  deposit: number
  rent: number
  isAuction: boolean
  buildingType: string
  roomCount: number
  floor: number
  direction: Direction
  area: {
    squareMeter: number
    pyeong: number
  }
}

/**
 * 매물 상세 데이터 타입 (상세 페이지용)
 */
export interface ListingDetailData {
  id: string
  name: string
  address: string
  deposit: number
  rent: number
  type: string
  area: number
  floor: number
  totalFloor: number
  description: string
  images: string[]
  features: string[]
  availableDate: string
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
