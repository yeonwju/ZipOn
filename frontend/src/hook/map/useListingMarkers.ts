import useClusteredMarkers from '@/hook/map/useClusteredMarkers'
import useDetailedMarkers from '@/hook/map/useDetailedMarkers'
import useMapZoomLevel from '@/hook/map/useMapZoomLevel'
import type { ListingData } from '@/types/listing'
import type { kakao } from '@/types/kakao.maps'

/**
 * 지도에 매물 마커를 표시하는 통합 훅
 *
 * 줌 레벨에 따라 클러스터/개별 마커를 자동 전환합니다.
 * - 레벨 5+: 클러스터 클릭 시 줌레벨 4로 이동
 * - 레벨 4: 클러스터 클릭 시 매물 정보를 콘솔에 출력
 * - 레벨 3 이하: 말풍선 개별 마커 (useDetailedMarkers, 호버 시 강조 효과)
 *
 * @param map - 카카오 지도 인스턴스
 * @param listings - 매물 데이터 배열
 * @param onMarkerClick - 마커 클릭 콜백
 * @param onClusterClick - 클러스터 클릭 콜백 (레벨 4에서만 실행)
 * @param isAuctionFilter - 경매 필터 여부 (true: 경매만, false: 일반만, undefined: 전체)
 *
 * @example
 * useListingMarkers(map, buildingData, (listing) => {
 *   setSelectedListing(listing)
 * }, (listings) => {
 *   console.log('클러스터 매물:', listings)
 * }, true)
 */
export default function useListingMarkers(
  map: kakao.maps.Map | null,
  listings: ListingData[],
  onMarkerClick?: (listing: ListingData) => void,
  onClusterClick?: (listings: ListingData[]) => void,
  isAuctionFilter?: boolean
) {
  // 현재 줌 레벨 추적
  const zoomLevel = useMapZoomLevel(map)

  // 레벨 4+ 클러스터 마커
  useClusteredMarkers(
    map,
    listings,
    onMarkerClick,
    onClusterClick,
    zoomLevel >= 4,
    zoomLevel,
    isAuctionFilter
  )

  // 레벨 3 이하 상세 마커
  useDetailedMarkers(map, listings, onMarkerClick, zoomLevel < 4)
}
