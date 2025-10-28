import useClusteredMarkers from '@/hook/useClusteredMarkers'
import useDetailedMarkers from '@/hook/useDetailedMarkers'
import useMapZoomLevel from '@/hook/useMapZoomLevel'
import type { kakao } from '@/types/kakao.maps'

/**
 * 매물 데이터 타입 정의
 * @property name - 건물명
 * @property address - 건물 주소
 * @property lat - 위도 (latitude)
 * @property lng - 경도 (longitude)
 * @property deposit - 보증금 (단위: 만원)
 * @property rent - 월세 (단위: 만원)
 */
export type ListingData = {
  name: string
  address: string
  lat: number
  lng: number
  deposit: number
  rent: number
}

/**
 * 지도에 매물 마커를 표시하는 통합 훅
 *
 * 줌 레벨에 따라 클러스터/개별 마커를 자동 전환합니다.
 * - 레벨 7+: 원형 클러스터 마커 (useClusteredMarkers)
 * - 레벨 6 이하: 말풍선 개별 마커 (useDetailedMarkers)
 *
 * @param map - 카카오 지도 인스턴스
 * @param listings - 매물 데이터 배열
 * @param onMarkerClick - 마커 클릭 콜백
 *
 * @example
 * useListingMarkers(map, buildingData, (listing) => {
 *   setSelectedListing(listing)
 * })
 */
export default function useListingMarkers(
  map: kakao.maps.Map | null,
  listings: ListingData[],
  onMarkerClick?: (listing: ListingData) => void
) {
  // 현재 줌 레벨 추적
  const zoomLevel = useMapZoomLevel(map)

  // 레벨 7+ 클러스터 마커
  useClusteredMarkers(map, listings, onMarkerClick, zoomLevel >= 7)

  // 레벨 6 이하 상세 마커
  useDetailedMarkers(map, listings, onMarkerClick, zoomLevel < 7)
}
