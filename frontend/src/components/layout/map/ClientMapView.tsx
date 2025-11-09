'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Map } from 'react-kakao-maps-sdk'

import { ListingList } from '@/components/features/listings'
import AllFiltersBottomSheet from '@/components/layout/modal/bottom/AllFiltersBottomSheet'
import BuildingTypeBottomSheet from '@/components/layout/modal/bottom/BuildingTypeBottomSheet'
import ListingBottomSheet from '@/components/layout/modal/bottom/ListingBottomSheet'
import PriceFilterBottomSheet from '@/components/layout/modal/bottom/PriceFilterBottomSheet'
import RoomCountFilterBottomSheet from '@/components/layout/modal/bottom/RoomCountFilterBottomSheet'
import { ROUTES } from '@/constants/routes'
import useKakaoLoader from '@/hooks/map/useKakaoLoader'
import useListingMarkers from '@/hooks/map/useListingMarkers'
import { useListingModal } from '@/hooks/map/useListingModal'
import { useMapControls } from '@/hooks/map/useMapControls'
import { useMapFilter } from '@/hooks/map/useMapFilter'
import useMapInteraction from '@/hooks/map/useMapInteraction'
import useUserLocation from '@/hooks/map/useUserLocation'
import useUserMarker from '@/hooks/map/useUserMarker'
import { useMapFilterStore } from '@/store/mapFilter'
import { DEFAULT_MAP_CENTER, DEFAULT_ZOOM_LEVEL } from '@/types/map'
import type { ListingData } from '@/types/models/listing'

import MapOverlay from './MapOverlay'

interface ClientMapViewProps {
  initialListings: ListingData[]
}

/**
 * 지도 클라이언트 컴포넌트
 *
 * 카카오맵 SDK와 인터랙션을 처리하는 클라이언트 전용 컴포넌트입니다.
 * 각 기능이 커스텀 훅과 컴포넌트로 분리되어 있어 관심사가 명확히 분리되었습니다.
 *
 * 기능:
 * - GPS 기반 현재 위치 추적 및 파란색 마커 표시
 * - 매물 위치에 말풍선 마커 표시 (클러스터링 지원)
 * - 레벨 4 이상: 클러스터 클릭 시 바텀 시트에 매물 목록 표시
 * - 레벨 3 이하: 상세 마커 모드 (호버 시 강조 효과)
 * - 필터링: 전체/경매/일반 매물 필터
 * - 현재 위치로 이동 버튼 (우측 하단, 줌 레벨 4로 이동)
 *
 * 바텀 시트 동작:
 * - 매물/클러스터 클릭 시 자동으로 열림
 * - 지도 드래그/줌 변경 시 자동으로 닫힘
 * - 드래그 핸들을 아래로 드래그하여 닫기
 */
export function ClientMapView({ initialListings }: ClientMapViewProps) {
  // 카카오맵 SDK 로드
  useKakaoLoader()
  const router = useRouter()
  // 사용자 위치 정보
  const { location } = useUserLocation()

  // 지도 초기 중심점 및 줌 레벨 (sessionStorage에서 복원)
  const [initialCenter, setInitialCenter] = useState<{ lat: number; lng: number } | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('mapCenter')
      if (saved) {
        return JSON.parse(saved)
      }
    }
    return null
  })

  const [initialZoom, setInitialZoom] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('mapZoom')
      if (saved) {
        return Number(saved)
      }
    }
    return DEFAULT_ZOOM_LEVEL
  })

  // 지도 제어 (지도 인스턴스, 위치 이동)
  const { map, setMap, moveToCurrentLocation, canMoveToLocation } = useMapControls(location)

  // 지도 이동 시 위치 및 줌 레벨 저장
  useEffect(() => {
    if (!map) return

    const saveMapState = () => {
      const center = map.getCenter()
      const level = map.getLevel()
      const centerData = {
        lat: center.getLat(),
        lng: center.getLng(),
      }
      sessionStorage.setItem('mapCenter', JSON.stringify(centerData))
      sessionStorage.setItem('mapZoom', String(level))
    }

    // 지도 이동 종료 시 위치 저장
    window.kakao?.maps.event.addListener(map, 'idle', saveMapState)

    return () => {
      window.kakao?.maps.event.removeListener(map, 'idle', saveMapState)
    }
  }, [map])

  // 매물 필터링 (store 기반)
  const { filteredListings, isAuctionFilter } = useMapFilter({
    listings: initialListings,
  })

  // 매물 모달 관리 (바텀시트 열기/닫기)
  const { isOpen: isModalOpen, selectedListings, openModal, closeModal } = useListingModal()

  // 건물 타입 선택 모달 상태
  const [isBuildingTypeModalOpen, setIsBuildingTypeModalOpen] = useState(false)

  // 필터 모달 상태
  const [isAllFiltersModalOpen, setIsAllFiltersModalOpen] = useState(false)
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false)
  const [isRoomCountModalOpen, setIsRoomCountModalOpen] = useState(false)

  // 지도 인터랙션 시 모달 자동 닫기 (드래그, 줌 변경)
  useMapInteraction(map, isModalOpen ? closeModal : undefined)

  // 사용자 현재 위치 마커
  useUserMarker(map, location)

  // 매물 마커 (클러스터링 지원) - 필터링된 매물 사용
  useListingMarkers(
    map,
    filteredListings,
    listing => {
      console.log('매물 클릭됨:', listing)
      openModal([listing])
    },
    listings => {
      // 클러스터 클릭 시 호출됨 (줌 레벨 4 이상)
      console.log(`🏢 클러스터 클릭 - ${listings.length}개 매물:`, listings)
      openModal(listings)
    },
    isAuctionFilter
  )

  // 매물 카드 클릭 핸들러
  const handleListingClick = (listing: ListingData) => {
    // 매물 상세 페이지로 이동
    router.push(ROUTES.LISTING_DETAIL(listing.propertySeq))
  }

  return (
    <div className="fixed inset-0 h-screen w-full overflow-hidden">
      {/* 지도 레이어 (최하단 고정) */}
      <div className="absolute inset-0 z-0">
        <Map
          id="map"
          center={initialCenter || DEFAULT_MAP_CENTER}
          style={{ width: '100%', height: '100%' }}
          level={initialZoom}
          onCreate={setMap}
        />
      </div>

      {/* UI 오버레이 (검색바, 필터, 제어 버튼) */}
      <MapOverlay
        onOpenBuildingTypeModal={() => setIsBuildingTypeModalOpen(true)}
        onOpenAllFiltersModal={() => setIsAllFiltersModalOpen(true)}
        onOpenPriceModal={() => setIsPriceModalOpen(true)}
        onOpenRoomCountModal={() => setIsRoomCountModalOpen(true)}
        onMoveToCurrentLocation={moveToCurrentLocation}
        canMoveToLocation={canMoveToLocation}
      >
        {/* 매물 목록 바텀 시트 */}
        <ListingBottomSheet
          isOpen={isModalOpen}
          onClose={closeModal}
          listingCount={selectedListings.length}
        >
          <ListingList listings={selectedListings} onListingClick={handleListingClick} />
        </ListingBottomSheet>

        {/* 건물 타입 선택 바텀 시트 */}
        <BuildingTypeBottomSheet
          isOpen={isBuildingTypeModalOpen}
          onClose={() => setIsBuildingTypeModalOpen(false)}
        />

        {/* 전체 필터 바텀 시트 */}
        <AllFiltersBottomSheet
          isOpen={isAllFiltersModalOpen}
          onClose={() => setIsAllFiltersModalOpen(false)}
        />

        {/* 금액 필터 바텀 시트 */}
        <PriceFilterBottomSheet
          isOpen={isPriceModalOpen}
          onClose={() => setIsPriceModalOpen(false)}
        />

        {/* 방수 필터 바텀 시트 */}
        <RoomCountFilterBottomSheet
          isOpen={isRoomCountModalOpen}
          onClose={() => setIsRoomCountModalOpen(false)}
        />
      </MapOverlay>
    </div>
  )
}
