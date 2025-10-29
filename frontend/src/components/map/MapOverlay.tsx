import type { ReactNode } from 'react'

import MapFilter from '@/components/layout/MapFilter'
import SearchBar from '@/components/layout/SearchBar'
import type { FilterType } from '@/types/listing'

import MapControls from './MapControls'

interface MapOverlayProps {
  /**
   * 현재 선택된 필터
   */
  selectedFilter: FilterType

  /**
   * 필터 변경 핸들러
   */
  onFilterChange: (filter: FilterType) => void

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
 */
export default function MapOverlay({
  selectedFilter,
  onFilterChange,
  onMoveToCurrentLocation,
  canMoveToLocation = false,
  children,
}: MapOverlayProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      {/* 검색바 */}
      <div className="pointer-events-auto absolute top-1 left-1 w-full pr-2">
        <SearchBar />
      </div>

      {/* 필터 버튼 */}
      <div className="pointer-events-auto absolute top-16 left-1/2 -translate-x-1/2">
        <MapFilter selectedFilter={selectedFilter} onFilterChange={onFilterChange} />
      </div>

      {/* 현재 위치로 이동 버튼 */}
      <MapControls
        onMoveToCurrentLocation={onMoveToCurrentLocation}
        disabled={!canMoveToLocation}
      />

      {/* 추가 컨텐츠 (바텀시트 등) */}
      {children}
    </div>
  )
}
