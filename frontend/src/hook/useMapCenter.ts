import { useEffect, useRef, useState } from 'react'

import type { kakao } from '@/types/kakao.maps'

/**
 * 지도 좌표 타입 정의
 * @property lat - 위도 (latitude)
 * @property lng - 경도 (longitude)
 */
interface Position {
  lat: number
  lng: number
}

/**
 * 지도 중심 좌표 변경을 감지하는 훅 (현재 미사용)
 * 
 * 지도 이동 시 디바운스를 적용하여 중심 좌표를 반환합니다.
 * 향후 지도 이동 시 매물을 다시 불러오는 기능에 활용 가능합니다.
 * 
 * @param map - 카카오 지도 인스턴스
 * @param defaultPosition - 초기 중심 좌표
 * @param debounceMs - 디바운스 시간 (기본 500ms)
 * @returns 현재 지도 중심 좌표
 * 
 * @example
 * const center = useMapCenter(map, defaultCenter, 1000)
 * useEffect(() => {
 *   fetchListingsInArea(center.lat, center.lng)
 * }, [center])
 */
export default function useMapCenter(
  map: kakao.maps.Map | null,
  defaultPosition: Position,
  debounceMs: number = 500
): Position {
  const [center, setCenter] = useState<Position>(defaultPosition)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!map) return

    /**
     * 지도 중심 변경 핸들러
     * 지도가 드래그되거나 이동할 때마다 호출됨
     */
    const handleCenterChanged = () => {
      // 이전 타이머가 있으면 취소
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // 지정된 시간 후에 새로운 중심 좌표 업데이트
      timeoutRef.current = setTimeout(() => {
        const latlng = map.getCenter()
        setCenter({ lat: latlng.getLat(), lng: latlng.getLng() })
        console.log(' 현재 지도 중심:', {
          lat: latlng.getLat(),
          lng: latlng.getLng(),
        })
      }, debounceMs)
    }

    // React-Kakao-Maps SDK의 이벤트 리스너는 자동으로 관리되므로
    // 여기서는 타이머만 정리합니다
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [map, debounceMs])

  return center
}

