'use client'

import { useState } from 'react'
import { Map } from 'react-kakao-maps-sdk'

import SearchBar from '@/components/layout/SearchBar'
import { BuildingData } from '@/data/Building'
import useKakaoLoader from '@/hook/useKakaoLoader'
import useListingMarkers from '@/hook/useListingMarkers'
import useUserLocation from '@/hook/useUserLocation'
import useUserMarker from '@/hook/useUserMarker'
import type { kakao } from '@/types/kakao.maps'

/**
 * 지도 페이지 메인 컴포넌트
 * 
 * 카카오 지도를 사용하여 사용자 위치와 매물 정보를 표시합니다.
 * 
 * 기능:
 * - GPS 기반 현재 위치 추적 및 파란색 마커 표시
 * - 매물 위치에 말풍선 마커 표시 (클러스터링 지원)
 * - 레벨 7+: 클러스터 모드, 레벨 6 이하: 상세 마커 모드
 */
export default function BasicMap() {
  useKakaoLoader()
  const { location } = useUserLocation()
  const [map, setMap] = useState<kakao.maps.Map | null>(null)
  const defaultCenter = { lat: 33.450701, lng: 126.570667 }

  // 사용자 현재 위치 마커
  useUserMarker(map, location, () => console.log('내 위치 마커 클릭됨!'))

  // 매물 마커 (클러스터링 지원)
  useListingMarkers(map, BuildingData, listing => {
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
        <div className="pointer-events-auto absolute left-1 top-1 z-10 w-full pr-2">
          <SearchBar />
        </div>
      </div>
    </div>
  )
}
