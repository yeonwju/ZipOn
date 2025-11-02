import { useEffect, useRef } from 'react'

import { createUserLocationMarkerElement } from '@/components/map/UserLocationMarker'

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
 * 사용자 위치 마커를 표시하는 훅
 *
 * GPS 위치에 파란색 파동 마커를 표시합니다.
 * 위치가 변경되면 마커가 자동으로 이동합니다.
 *
 * CustomOverlay zIndex: 100 (클러스터 및 다른 마커보다 위에 표시)
 * 내부 요소 z-index는 UserLocationMarker 컴포넌트 참고
 *
 * @param map - 카카오 지도 인스턴스
 * @param position - 마커 위치 좌표 (null이면 마커 미표시)
 * @param onClick - 마커 클릭 콜백
 *
 * @example
 * const { location } = useUserLocation()
 * useUserMarker(map, location, () => console.log('클릭!'))
 */
export default function useUserMarker(map: KakaoMap | null, position: Position | null, onClick?: () => void) {
  const overlayRef = useRef<KakaoCustomOverlay | null>(null)

  useEffect(() => {
    if (!map || !window.kakao || !position) {
      // 기존 마커 정리
      if (overlayRef.current) {
        overlayRef.current.setMap(null)
        overlayRef.current = null
      }
      return
    }

    // 이전 마커 제거
    if (overlayRef.current) {
      overlayRef.current.setMap(null)
    }

    // UI 요소 생성
    const markerElement = createUserLocationMarkerElement(onClick)

    // CustomOverlay 생성
    const overlay = new window.kakao.maps.CustomOverlay({
      position: new window.kakao.maps.LatLng(position.lat, position.lng),
      content: markerElement,
      xAnchor: 0.5,
      yAnchor: 0.5,
      clickable: true,
    })

    overlay.setMap(map)
    overlayRef.current = overlay

    // cleanup
    return () => {
      if (overlayRef.current) {
        overlayRef.current.setMap(null)
      }
    }
  }, [map, position, onClick])
}
