'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Map } from 'react-kakao-maps-sdk'

import AllFiltersBottomSheet from '@/components/layout/modal/bottom/AllFiltersBottomSheet'
import BuildingTypeBottomSheet from '@/components/layout/modal/bottom/BuildingTypeBottomSheet'
import ListingBottomSheet from '@/components/layout/modal/bottom/ListingBottomSheet'
import PriceFilterBottomSheet from '@/components/layout/modal/bottom/PriceFilterBottomSheet'
import RoomCountFilterBottomSheet from '@/components/layout/modal/bottom/RoomCountFilterBottomSheet'
import ListingList from '@/components/map/ListingList'
import useKakaoLoader from '@/hook/map/useKakaoLoader'
import useListingMarkers from '@/hook/map/useListingMarkers'
import { useListingModal } from '@/hook/map/useListingModal'
import { useMapControls } from '@/hook/map/useMapControls'
import { useMapFilter } from '@/hook/map/useMapFilter'
import useMapInteraction from '@/hook/map/useMapInteraction'
import useUserLocation from '@/hook/map/useUserLocation'
import useUserMarker from '@/hook/map/useUserMarker'
import type {
  AreaFilter,
  DirectionFilter,
  FloorFilter,
  PriceFilter,
  RoomCountFilter,
} from '@/types/filter'
import type { ListingData } from '@/types/listing'
import { DEFAULT_MAP_CENTER, DEFAULT_ZOOM_LEVEL } from '@/types/map'

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

  // 지도 제어 (지도 인스턴스, 위치 이동)
  const { map, setMap, moveToCurrentLocation, canMoveToLocation } = useMapControls(location)

  // 필터 상태
  const [priceFilter, setPriceFilter] = useState<PriceFilter>({
    deposit: { min: 0, max: null },
    rent: { min: 0, max: null },
    maintenance: { min: 0, max: null },
  })
  const [roomCountFilter, setRoomCountFilter] = useState<RoomCountFilter | undefined>(undefined)
  const [areaFilter, setAreaFilter] = useState<AreaFilter | undefined>(undefined)
  const [floorFilter, setFloorFilter] = useState<FloorFilter | undefined>(undefined)
  const [directionFilter, setDirectionFilter] = useState<DirectionFilter | undefined>(undefined)

  // 매물 필터링 (필터 상태, 필터링된 매물)
  const {
    auctionFilter,
    setAuctionFilter,
    buildingType,
    setBuildingType,
    filteredListings,
    isAuctionFilter,
  } = useMapFilter({
    listings: initialListings,
    priceFilter,
    roomCountFilter,
    areaFilter,
    floorFilter,
    directionFilter,
  })

  // 매물 모달 관리 (바텀시트 열기/닫기)
  const { isOpen: isModalOpen, selectedListings, openModal, closeModal } = useListingModal()

  // 건물 타입 선택 모달 상태
  const [isBuildingTypeModalOpen, setIsBuildingTypeModalOpen] = useState(false)

  // 필터 모달 상태
  const [isAllFiltersModalOpen, setIsAllFiltersModalOpen] = useState(false)
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false)
  const [isRoomCountModalOpen, setIsRoomCountModalOpen] = useState(false)

  // 전체 필터 적용
  const handleApplyAllFilters = () => {
    setIsAllFiltersModalOpen(false)
  }

  // 전체 필터 초기화
  const handleResetAllFilters = () => {
    setPriceFilter({
      deposit: { min: 0, max: null },
      rent: { min: 0, max: null },
      maintenance: { min: 0, max: null },
    })
    setRoomCountFilter(undefined)
    setAreaFilter(undefined)
    setFloorFilter(undefined)
    setDirectionFilter(undefined)
    setIsAllFiltersModalOpen(false)
  }

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
    router.push(`/listings/${listing.id}`)
  }

  return (
    <div className="fixed inset-0 h-screen w-full overflow-hidden">
      {/* 지도 레이어 (최하단 고정) */}
      <div className="absolute inset-0 z-0">
        <Map
          id="map"
          center={location || DEFAULT_MAP_CENTER}
          style={{ width: '100%', height: '100%' }}
          level={DEFAULT_ZOOM_LEVEL}
          onCreate={setMap}
        />
      </div>

      {/* UI 오버레이 (검색바, 필터, 제어 버튼) */}
      <MapOverlay
        selectedAuctionFilter={auctionFilter}
        selectedBuildingType={buildingType}
        onAuctionFilterChange={setAuctionFilter}
        onBuildingTypeChange={setBuildingType}
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
          selectedType={buildingType}
          onSelectType={setBuildingType}
        />

        {/* 전체 필터 바텀 시트 */}
        <AllFiltersBottomSheet
          isOpen={isAllFiltersModalOpen}
          onClose={() => setIsAllFiltersModalOpen(false)}
          priceFilter={priceFilter}
          roomCountFilter={roomCountFilter ?? 'all'}
          areaFilter={areaFilter ?? { min: 1, max: 100 }}
          floorFilter={floorFilter ?? 'all'}
          directionFilter={directionFilter ?? 'all'}
          onPriceChange={setPriceFilter}
          onRoomCountChange={value => setRoomCountFilter(value === 'all' ? undefined : value)}
          onAreaChange={setAreaFilter}
          onFloorChange={value => setFloorFilter(value === 'all' ? undefined : value)}
          onDirectionChange={value => setDirectionFilter(value === 'all' ? undefined : value)}
          onResetFilters={handleResetAllFilters}
          onApplyFilters={handleApplyAllFilters}
        />

        {/* 금액 필터 바텀 시트 */}
        <PriceFilterBottomSheet
          isOpen={isPriceModalOpen}
          onClose={() => setIsPriceModalOpen(false)}
          selectedPrice={priceFilter}
          onSelectPrice={setPriceFilter}
        />

        {/* 방수 필터 바텀 시트 */}
        <RoomCountFilterBottomSheet
          isOpen={isRoomCountModalOpen}
          onClose={() => setIsRoomCountModalOpen(false)}
          selectedRoomCount={roomCountFilter ?? 'all'}
          onSelectRoomCount={setRoomCountFilter}
        />
      </MapOverlay>
    </div>
  )
}
