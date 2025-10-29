import { useCallback, useState } from 'react'

import type { kakao } from '@/types/kakao.maps'
import type { Coordinates } from '@/types/map'
import { CURRENT_LOCATION_ZOOM_LEVEL } from '@/types/map'

/**
 * 지도 제어 훅
 *
 * 지도 인스턴스와 위치 이동 등의 제어 기능을 제공합니다.
 *
 * @param userLocation - 사용자 현재 위치
 * @returns 지도 인스턴스와 제어 함수들
 *
 * @example
 * ```tsx
 * const { map, setMap, moveToCurrentLocation } = useMapControls(location)
 * ```
 */
export function useMapControls(userLocation: Coordinates | null) {
  const [map, setMap] = useState<kakao.maps.Map | null>(null)

  /**
   * 현재 위치로 지도 이동
   */
  const moveToCurrentLocation = useCallback(() => {
    if (map && userLocation) {
      map.setLevel(CURRENT_LOCATION_ZOOM_LEVEL)
      map.setCenter(new window.kakao.maps.LatLng(userLocation.lat, userLocation.lng))
    }
  }, [map, userLocation])

  return {
    map,
    setMap,
    moveToCurrentLocation,
    canMoveToLocation: !!(map && userLocation),
  }
}
