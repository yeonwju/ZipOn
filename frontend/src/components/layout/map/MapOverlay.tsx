import { ChevronDown, SlidersHorizontal } from 'lucide-react'
import type { ReactNode } from 'react'

import { AuctionTypeFilter, BuildingTypeFilter } from '@/components/features/listings'
import { MapControls } from '@/components/features/map'
import SearchBar from '@/components/layout/SearchBar'
import type { AuctionType, BuildingType } from '@/types/models/listing'

interface MapOverlayProps {
  /**
   * 현재 선택된 필터
   */
  selectedAuctionFilter: AuctionType
  selectedBuildingType: BuildingType | 'all'

  /**
   * 필터 변경 핸들러
   */
  onAuctionFilterChange: (filter: AuctionType) => void
  onBuildingTypeChange: (filter: BuildingType) => void

  /**
   * 건물 타입 선택 모달 열기
   */
  onOpenBuildingTypeModal: () => void

  /**
   * 전체 필터 모달 열기
   */
  onOpenAllFiltersModal: () => void

  /**
   * 금액 필터 모달 열기
   */
  onOpenPriceModal: () => void

  /**
   * 방개수 필터 모달 열기
   */
  onOpenRoomCountModal: () => void

  /**
   * 현재 위치로 이동 핸들러
   */
  onMoveToCurrentLocation: () => void

  /**
   * 위치 이동 버튼 활성화 여부
   */
  canMoveToLocation?: boolean

  /**
   * 추가 컨텐츠 (바텀시트 등)
   */
  children?: ReactNode
}

/**
 * 지도 위에 표시되는 UI 오버레이 컴포넌트
 *
 * 검색바, 필터, 제어 버튼 등을 포함합니다.
 * 지도와 분리된 레이어에서 동작하며 pointer-events를 선택적으로 제어합니다.
 * Flexbox 레이아웃으로 반응형 지원.
 *
 * 중요: 컨테이너는 pointer-events-none으로 설정하여 여백 클릭 시 지도 인터랙션 가능
 */
export default function MapOverlay({
  selectedAuctionFilter,
  selectedBuildingType,
  onAuctionFilterChange,
  onBuildingTypeChange,
  onOpenBuildingTypeModal,
  onOpenAllFiltersModal,
  onOpenPriceModal,
  onOpenRoomCountModal,
  onMoveToCurrentLocation,
  canMoveToLocation = false,
  children,
}: MapOverlayProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      {/* 상단 영역: 건물 타입 필터 + 검색바 */}
      <div className="pointer-events-none flex h-15 items-start gap-1 p-1">
        {/* 건물 타입 필터 버튼 */}
        <div className="pointer-events-auto flex h-full shrink-0 items-center justify-center">
          <BuildingTypeFilter
            selectedFilter={selectedBuildingType}
            onClick={onOpenBuildingTypeModal}
          />
        </div>

        {/* 검색바 - flex-1로 남은 공간 모두 차지 */}
        <div className="pointer-events-auto flex h-full w-full">
          <SearchBar />
        </div>
      </div>

      {/* 중단 영역: 추가 필터 버튼 & 경매 타입 필터 */}
      <div className="pointer-events-none flex items-start justify-between px-1 pt-1">
        {/* 왼쪽: 추가 필터 버튼 */}
        <div className={'flex flex-row gap-2'}>
          <button
            onClick={onOpenAllFiltersModal}
            className="pointer-events-auto flex items-center justify-center rounded-2xl bg-white px-3 py-1.5 shadow-md transition-all hover:bg-gray-50 active:scale-95"
            aria-label="전체 필터"
          >
            <div className="rotate-90">
              <SlidersHorizontal size={16} />
            </div>
          </button>

          <button
            onClick={onOpenPriceModal}
            className="pointer-events-auto flex items-center justify-center gap-1 rounded-2xl bg-white px-3 py-1.5 shadow-md transition-all hover:bg-gray-50 active:scale-95"
            aria-label="가격 필터"
          >
            <span className="text-sm font-medium">가격</span>
            <ChevronDown size={16} />
          </button>

          <button
            onClick={onOpenRoomCountModal}
            className="pointer-events-auto flex items-center justify-center gap-1 rounded-2xl bg-white px-3 py-1.5 shadow-md transition-all hover:bg-gray-50 active:scale-95"
            aria-label="방개수 필터"
          >
            <span className="text-sm font-medium">방개수</span>
            <ChevronDown size={16} />
          </button>
        </div>
        {/* 오른쪽: 경매 타입 필터 */}
        <div className="pointer-events-auto shrink-0">
          <AuctionTypeFilter
            selectedFilter={selectedAuctionFilter}
            onFilterChange={onAuctionFilterChange}
          />
        </div>
      </div>

      {/* 우측 하단: 지도 컨트롤 (현재 위치 이동 버튼) */}
      <MapControls
        onMoveToCurrentLocation={onMoveToCurrentLocation}
        disabled={!canMoveToLocation}
      />

      {/* 추가 컨텐츠 (바텀시트 등) */}
      {children}
    </div>
  )
}
