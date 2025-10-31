/**
 * API 응답 필터 타입 정의
 *
 * 이 타입은 API 서버에서 받아오는 필터 데이터의 구조를 정의합니다.
 * API 구조가 변경되면 이 파일만 수정하면 됩니다.
 */

/**
 * API 금액 필터 응답 타입
 * (API에서 받아오는 형식 - 실제 API 응답에 맞게 수정 가능)
 */
export type ApiPriceFilter = {
  deposit_min?: number // API에서는 snake_case일 수 있음
  deposit_max?: number | null
  rent_min?: number
  rent_max?: number | null
  maintenance_min?: number
  maintenance_max?: number | null
}

/**
 * API 방 개수 필터 응답 타입
 */
export type ApiRoomCountFilter = number | 'more_than_3' | string

/**
 * API 면적 필터 응답 타입
 */
export type ApiAreaFilter = {
  area_min?: number
  area_max?: number
}

/**
 * API 층수 필터 응답 타입
 */
export type ApiFloorFilter = 'basement' | number | 'above_2' | 'B1' | string

/**
 * API 해방향 필터 응답 타입
 */
export type ApiDirectionFilter = 'east' | 'west' | 'south' | 'north' | 'northwest' | string

/**
 * 전체 API 필터 응답 타입
 */
export type ApiFilterResponse = {
  price?: ApiPriceFilter
  room_count?: ApiRoomCountFilter
  area?: ApiAreaFilter
  floor?: ApiFloorFilter
  direction?: ApiDirectionFilter
  // 새로운 필터를 여기에 추가하면 됩니다
  // 예: property_type?: string
  // 예: location?: { city?: string; district?: string }
}

/**
 * API 필터 요청 타입 (필터 적용 시 API로 보내는 데이터)
 */
export type ApiFilterRequest = {
  price?: ApiPriceFilter
  room_count?: ApiRoomCountFilter
  area?: ApiAreaFilter
  floor?: ApiFloorFilter
  direction?: ApiDirectionFilter
  // 새로운 필터를 여기에 추가하면 됩니다
}

