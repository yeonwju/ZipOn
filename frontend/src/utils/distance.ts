/**
 * 두 좌표 간의 거리를 계산하는 유틸리티 함수
 */

interface Coordinates {
  lat: number
  lng: number
}

/**
 * Haversine 공식을 사용하여 두 좌표 간의 거리를 미터 단위로 계산합니다.
 *
 * @param coord1 - 첫 번째 좌표
 * @param coord2 - 두 번째 좌표
 * @returns 두 좌표 간의 거리 (미터)
 *
 * @example
 * const distance = calculateDistance(
 *   { lat: 37.5665, lng: 126.9780 },
 *   { lat: 37.5700, lng: 126.9850 }
 * )
 * console.log(distance) // 약 700m
 */
export function calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371e3 // 지구 반지름 (미터)
  const φ1 = (coord1.lat * Math.PI) / 180 // 위도를 라디안으로 변환
  const φ2 = (coord2.lat * Math.PI) / 180
  const Δφ = ((coord2.lat - coord1.lat) * Math.PI) / 180
  const Δλ = ((coord2.lng - coord1.lng) * Math.PI) / 180

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  const distance = R * c // 미터 단위 거리

  return distance
}

/**
 * 거리를 읽기 쉬운 형식으로 변환합니다.
 *
 * @param meters - 미터 단위 거리
 * @returns 포맷팅된 거리 문자열
 *
 * @example
 * formatDistance(50) // "50m"
 * formatDistance(1500) // "1.5km"
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`
  }
  return `${(meters / 1000).toFixed(1)}km`
}

