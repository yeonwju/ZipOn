import { useEffect, useRef } from 'react'

import type { ListingData } from '@/hook/map/useListingMarkers'
import type { kakao } from '@/types/kakao.maps'

/**
 * 매물을 클러스터 마커로 표시하는 훅
 *
 * 여러 매물을 그룹화하여 원형 클러스터로 표시합니다.
 * 주로 줌 레벨이 높을 때(4+) 사용됩니다.
 *
 * @param map - 카카오 지도 인스턴스
 * @param listings - 매물 데이터 배열
 * @param onMarkerClick - 마커 클릭 콜백
 * @param onClusterClick - 클러스터 클릭 콜백
 * @param enabled - 클러스터 마커 활성화 여부 (기본: true)
 * @param currentZoomLevel - 현재 줌 레벨
 *
 * @example
 * useClusteredMarkers(map, buildingData, onMarkerClick, onClusterClick, zoomLevel >= 4, zoomLevel)
 */
export default function useClusteredMarkers(
  map: kakao.maps.Map | null,
  listings: ListingData[],
  onMarkerClick?: (listing: ListingData) => void,
  onClusterClick?: (listings: ListingData[]) => void,
  enabled: boolean = true,
  currentZoomLevel?: number
) {
  const clustererRef = useRef<kakao.maps.MarkerClusterer | null>(null)
  const markersRef = useRef<kakao.maps.Marker[]>([])
  const markerToListingMap = useRef<Map<kakao.maps.Marker, ListingData>>(new Map())

  useEffect(() => {
    // 비활성화 상태이거나 필수 조건이 없으면 실행 안 함
    if (!enabled || !map || !window.kakao || !listings || listings.length === 0) {
      // 기존 클러스터 정리
      if (clustererRef.current) {
        clustererRef.current.clear()
        clustererRef.current = null
      }
      markersRef.current.forEach(marker => marker.setMap(null))
      markersRef.current = []
      markerToListingMap.current.clear()
      return
    }

    // 이전 클러스터 정리
    if (clustererRef.current) {
      clustererRef.current.clear()
      clustererRef.current = null
    }
    markersRef.current.forEach(marker => marker.setMap(null))
    markersRef.current = []
    markerToListingMap.current.clear()

    // 개별 마커 생성 및 매핑
    const markers = listings.map(listing => {
      const marker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(listing.lat, listing.lng),
        clickable: true,
      })

      // 마커-매물 데이터 매핑
      markerToListingMap.current.set(marker, listing)

      // 마커 클릭 이벤트
      if (onMarkerClick) {
        window.kakao.maps.event.addListener(marker, 'click', () => {
          onMarkerClick(listing)
        })
      }

      return marker
    })

    // 클러스터러 생성
    const clusterStyles: kakao.maps.ClusterStyle[] = [
      {
        width: '50px',
        height: '50px',
        background: 'rgba(59, 130, 246, 0.8)',
        borderRadius: '25px',
        color: '#fff',
        textAlign: 'center',
        lineHeight: '50px',
        fontWeight: 'bold',
        fontSize: '14px',
      },
      {
        width: '60px',
        height: '60px',
        background: 'rgba(37, 99, 235, 0.85)',
        borderRadius: '30px',
        color: '#fff',
        textAlign: 'center',
        lineHeight: '60px',
        fontWeight: 'bold',
        fontSize: '16px',
      },
      {
        width: '70px',
        height: '70px',
        background: 'rgba(29, 78, 216, 0.9)',
        borderRadius: '35px',
        color: '#fff',
        textAlign: 'center',
        lineHeight: '70px',
        fontWeight: 'bold',
        fontSize: '18px',
      },
    ]

    const clusterer = new window.kakao.maps.MarkerClusterer({
      map: map,
      markers: markers,
      gridSize: 60,
      averageCenter: true,
      minLevel: 4,
      minClusterSize: 1,
      disableClickZoom: true, // 수동으로 줌 제어
      clickable: true,
      styles: clusterStyles,
    })

    clustererRef.current = clusterer
    markersRef.current = markers

    // 클러스터 클릭 이벤트 리스너 추가
    window.kakao.maps.event.addListener(clusterer, 'clusterclick', (event?: unknown) => {
      const cluster = event as kakao.maps.Cluster

      // 클러스터에 포함된 마커들 가져오기
      const clusterMarkers = cluster.getMarkers() as kakao.maps.Marker[]

      // 마커들에 해당하는 매물 데이터 추출
      const clusterListings = clusterMarkers
        .map(marker => markerToListingMap.current.get(marker))
        .filter((listing): listing is ListingData => listing !== undefined)

      // 현재 줌 레벨에 따라 동작 구분
      if (currentZoomLevel && currentZoomLevel > 4) {
        // 5레벨 이상의 클러스터 클릭 시 -> 줌레벨 4로 변경
        map?.setLevel(4)
        map?.setCenter(cluster.getCenter())
      } else if (currentZoomLevel === 4) {
        // 4레벨 클러스터 클릭 시 -> 콜백 실행 (로그는 컴포넌트에서 처리)
        if (onClusterClick) {
          onClusterClick(clusterListings)
        }
      }
    })

    // cleanup
    return () => {
      if (clustererRef.current) {
        clustererRef.current.clear()
      }
      markersRef.current.forEach(marker => marker.setMap(null))
      markersRef.current = []
      markerToListingMap.current.clear()
    }
  }, [map, listings, onMarkerClick, onClusterClick, enabled, currentZoomLevel])
}
