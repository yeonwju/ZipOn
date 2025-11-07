/**
 * 라이브 도메인 모델
 */

/**
 * 라이브 아이템 데이터
 */
export interface LiveItemData {
  id: number
  imgSrc: string
  title: string
  viewCnt: number
  chatCnt: number
  brokerName: string
  brokerImgSrc: string
}

/**
 * 라이브 생성 폼 데이터
 */
export interface LiveCreateFormData {
  title: string
  address: string
  addressCoords: { lat: number; lng: number } | null
  listingId?: number
}

