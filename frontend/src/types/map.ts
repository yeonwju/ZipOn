/**
 * 지도 관련 타입 정의
 */

/**
 * 좌표 타입
 */
export type Coordinates = {
  lat: number
  lng: number
}

/**
 * 지도 중심점 기본값 (제주도)
 */
export const DEFAULT_MAP_CENTER: Coordinates = {
  lat: 33.450701,
  lng: 126.570667,
}

/**
 * 지도 기본 줌 레벨
 */
export const DEFAULT_ZOOM_LEVEL = 5

/**
 * 현재 위치 이동 시 줌 레벨
 */
export const CURRENT_LOCATION_ZOOM_LEVEL = 4
