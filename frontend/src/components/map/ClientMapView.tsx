'use client'

import { LocateFixed, Navigation } from 'lucide-react'
import { useState } from 'react'
import { Map } from 'react-kakao-maps-sdk'

import ListingList from '@/components/item/map/ListingList'
import BottomSheet from '@/components/layout/modal/BottomSheet'
import SearchBar from '@/components/layout/SearchBar'
import useKakaoLoader from '@/hook/map/useKakaoLoader'
import type { ListingData } from '@/hook/map/useListingMarkers'
import useListingMarkers from '@/hook/map/useListingMarkers'
import useMapInteraction from '@/hook/map/useMapInteraction'
import useUserLocation from '@/hook/map/useUserLocation'
import useUserMarker from '@/hook/map/useUserMarker'
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
 * - 레벨 4 이상: 클러스터 클릭 시 바텀 시트에 매물 목록 표시
 * - 레벨 3 이하: 상세 마커 모드 (호버 시 강조 효과)
 * - 현재 위치로 이동 버튼 (우측 하단, 줌 레벨 4로 이동)
 *
 * 바텀 시트 동작:
 * - 매물/클러스터 클릭 시 자동으로 열림
 * - 지도 드래그/줌 변경 시 자동으로 닫힘
 * - 드래그 핸들을 아래로 드래그하여 닫기
 */
export function ClientMapView({ initialListings }: ClientMapViewProps) {
  useKakaoLoader()
  const { location } = useUserLocation()
  const [map, setMap] = useState<kakao.maps.Map | null>(null)
  const defaultCenter = { lat: 33.450701, lng: 126.570667 }

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedListings, setSelectedListings] = useState<ListingData[]>([])

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedListings([])
  }

  const openModal = (listings?: ListingData[]) => {
    // 매물이 없으면 모달을 열지 않음
    if (!listings || listings.length === 0) {
      return
    }
    setIsModalOpen(true)
    setSelectedListings(listings)
  }

  // 지도 인터랙션 시 모달 자동 닫기 (드래그, 줌 변경)
  useMapInteraction(map, isModalOpen ? closeModal : undefined)

  // 사용자 현재 위치 마커
  useUserMarker(map, location)

  // 매물 마커 (클러스터링 지원)
  useListingMarkers(
    map,
    initialListings,
    listing => {
      console.log('매물 클릭됨:', listing)
      openModal([listing])
    },
    listings => {
      // 클러스터 클릭 시 호출됨 (줌 레벨 4 이상)
      console.log(`🏢 클러스터 클릭 - ${listings.length}개 매물:`, listings)
      openModal(listings)
    }
  )

  // 매물 카드 클릭 핸들러
  const handleListingClick = (listing: ListingData) => {
    // 매물 상세 페이지로 이동
    window.location.href = `/listing/${listing.id}`
  }

  // 현재 위치로 이동
  const moveToCurrentLocation = () => {
    if (map && location) {
      map.setLevel(4) // 줌 레벨 4로 설정
      map.setCenter(new window.kakao.maps.LatLng(location.lat, location.lng)) // 현재 위치로 이동
    }
  }

  return (
    <div className="fixed inset-0 h-screen w-full overflow-hidden">
      {/* 지도 레이어 (최하단 고정) */}
      <div className="absolute inset-0 z-0">
        <Map
          id="map"
          center={location || defaultCenter}
          style={{ width: '100%', height: '100%' }}
          level={5}
          onCreate={setMap}
        />
      </div>

      {/* UI 레이어 (지도 위) */}
      <div className="pointer-events-none absolute inset-0 z-10">
        {/* 검색바 */}
        <div className="pointer-events-auto absolute top-1 left-1 w-full pr-2">
          <SearchBar />
        </div>

        {/* 현재 위치로 이동 버튼 */}
        <button
          onClick={moveToCurrentLocation}
          disabled={!location}
          className="pointer-events-auto absolute right-4 bottom-20 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg transition-all hover:scale-110 hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100"
          aria-label="현재 위치로 이동"
        >
          <LocateFixed className="h-5 w-5 text-blue-500" />
        </button>

        {/* 바텀 시트 */}
        <BottomSheet
          isOpen={isModalOpen}
          onClose={closeModal}
          listingCount={selectedListings.length}
        >
          <ListingList listings={selectedListings} onListingClick={handleListingClick} />
        </BottomSheet>
      </div>
    </div>
  )
}
