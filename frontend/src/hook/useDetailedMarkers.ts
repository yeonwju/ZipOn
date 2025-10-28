import { useEffect, useRef } from 'react'

import { createListingMarkerElement } from '@/components/ui/ListingMarker'
import type { ListingData } from '@/hook/useListingMarkers'
import type { kakao } from '@/types/kakao.maps'

/**
 * 매물을 상세 말풍선 마커로 표시하는 훅
 *
 * 각 매물을 개별 말풍선 마커로 표시합니다.
 * 주로 줌 레벨이 낮을 때(3 이하) 사용됩니다.
 * 마우스 호버 시 z-index 상승 및 강조 효과(확대, 그림자)가 적용됩니다.
 *
 * @param map - 카카오 지도 인스턴스
 * @param listings - 매물 데이터 배열
 * @param onMarkerClick - 마커 클릭 콜백
 * @param enabled - 상세 마커 활성화 여부 (기본: true)
 *
 * @example
 * useDetailedMarkers(map, buildingData, onMarkerClick, zoomLevel < 4)
 */
export default function useDetailedMarkers(
  map: kakao.maps.Map | null,
  listings: ListingData[],
  onMarkerClick?: (listing: ListingData) => void,
  enabled: boolean = true
) {
  const overlaysRef = useRef<kakao.maps.CustomOverlay[]>([])

  useEffect(() => {
    // 비활성화 상태이거나 필수 조건이 없으면 실행 안 함
    if (!enabled || !map || !window.kakao || !listings || listings.length === 0) {
      // 기존 오버레이 정리
      overlaysRef.current.forEach(overlay => overlay.setMap(null))
      overlaysRef.current = []
      return
    }

    // 이전 오버레이 정리
    overlaysRef.current.forEach(overlay => overlay.setMap(null))
    overlaysRef.current = []

    // 각 매물에 대해 말풍선 마커 생성
    listings.forEach(listing => {
      const markerElement = createListingMarkerElement(listing, onMarkerClick)

      const overlay = new window.kakao.maps.CustomOverlay({
        position: new window.kakao.maps.LatLng(listing.lat, listing.lng),
        content: markerElement,
        xAnchor: 0.5,
        yAnchor: 1,
        clickable: true,
        zIndex: 1,
      })

      // 마우스 호버 시 강조 효과
      markerElement.addEventListener('mouseenter', () => {
        overlay.setZIndex(1000)
        // 확대 및 강조 효과
        markerElement.style.transform = 'scale(1.15)'
        markerElement.style.filter = 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3))'
        markerElement.style.transition = 'all 0.2s ease-out'
      })

      markerElement.addEventListener('mouseleave', () => {
        overlay.setZIndex(1)
        // 원래 상태로 복원
        markerElement.style.transform = 'scale(1)'
        markerElement.style.filter = 'none'
      })

      overlay.setMap(map)
      overlaysRef.current.push(overlay)
    })

    // cleanup
    return () => {
      overlaysRef.current.forEach(overlay => overlay.setMap(null))
      overlaysRef.current = []
    }
  }, [map, listings, onMarkerClick, enabled])
}
