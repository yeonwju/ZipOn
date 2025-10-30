/**
 * 매물 관련 타입 정의
 */

/**
 * 해방향 타입
 */
export type Direction = 'east' | 'west' | 'south' | 'north'

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
 * @property buildingType - 건물 유형
 * @property roomCount - 방 개수
 * @property floor - 층수
 * @property direction - 해방향 (동/서/남/북)
 * @property area - 면적 (제곱미터 및 평)
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
 * 필터 타입
 * - all: 전체 매물
 * - auction: 경매 매물만
 * - normal: 일반 매물만
 */
export type AuctionType = 'all' | 'auction' | 'normal'
export type BuildingType = 'room' | 'apartment' | 'house' | 'officetel'
