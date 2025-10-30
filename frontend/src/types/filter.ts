/**
 * 필터 관련 타입 정의
 */

/**
 * 금액 필터 타입 (각각 독립적으로 관리)
 */
export type PriceFilter = {
  deposit: {
    // 보증금
    min: number
    max: number | null
  }
  rent: {
    // 월세
    min: number
    max: number | null
  }
  maintenance: {
    // 관리비
    min: number
    max: number | null
  }
}

/**
 * 방수 필터 타입
 */
export type RoomCountFilter = 1 | 2 | 3 | '3+' // 3+는 3개 이상

/**
 * 면적 필터 타입
 */
export type AreaFilter = {
  min: number // 최소 평수
  max: number // 최대 평수
}

/**
 * 층수 필터 타입
 */
export type FloorFilter = 'basement' | 1 | 2 | '2+' | 'B1' // basement: 지하, 2+: 2층 이상

/**
 * 해방향 필터 타입
 */
export type DirectionFilter = 'east' | 'west' | 'south' | 'north' | 'northwest'

/**
 * 전체 필터 상태 타입
 */
export type FilterState = {
  price?: PriceFilter
  roomCount?: RoomCountFilter
  area?: AreaFilter
  floor?: FloorFilter
  direction?: DirectionFilter
}
