'use client'

import { useState } from 'react'
import { Map } from 'react-kakao-maps-sdk'

import SearchBar from '@/components/layout/SearchBar'
import useKakaoLoader from '@/hook/useKakaoLoader'
import type { ListingData } from '@/hook/useListingMarkers'
import useListingMarkers from '@/hook/useListingMarkers'
import useUserLocation from '@/hook/useUserLocation'
import useUserMarker from '@/hook/useUserMarker'
import type { kakao } from '@/types/kakao.maps'

interface ClientMapViewProps {
  initialListings: ListingData[]
}

/**
 * 지도 클라이언트 컴포넌트
 *
 * 카카오맵 SDK와 인터랙션을 처리하는 클라이언트 전용 컴포넌트입니다.
 *
 * 기능:
 * - GPS 기반 현재 위치 추적 및 파란색 마커 표시
 * - 매물 위치에 말풍선 마커 표시 (클러스터링 지원)
 * - 레벨 4+: 클러스터 모드, 레벨 3 이하: 상세 마커 모드 (호버 시 강조 효과)
 */
export function ClientMapView({ initialListings }: ClientMapViewProps) {
  useKakaoLoader()
  const { location } = useUserLocation()
  const [map, setMap] = useState<kakao.maps.Map | null>(null)
  const defaultCenter = { lat: 33.450701, lng: 126.570667 }

  // 사용자 현재 위치 마커
  useUserMarker(map, location, () => console.log('내 위치 마커 클릭됨!'))

  // 매물 마커 (클러스터링 지원)
  useListingMarkers(map, initialListings, listing => {
    console.log('매물 클릭됨:', listing)
    // TODO: 모달 열기 로직 추가
  })

  return (
    <div className="relative h-screen w-full">
      <Map
        id="map"
        center={location || defaultCenter}
        style={{ width: '100%', height: '100%' }}
        level={5}
        className="absolute inset-0 z-0"
        onCreate={setMap}
      />

      <div className="pointer-events-none absolute inset-0">
        <div className="pointer-events-auto absolute top-1 left-1 z-10 w-full pr-2">
          <SearchBar />
        </div>
      </div>
    </div>
  )
}
