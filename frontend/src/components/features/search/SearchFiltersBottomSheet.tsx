'use client'

import React, { useState } from 'react'

import {
  AreaFilter as AreaFilterComponent,
  DirectionFilter as DirectionFilterComponent,
  FloorFilter as FloorFilterComponent,
  PriceFilter as PriceFilterComponent,
  RoomCountFilter as RoomCountFilterComponent,
} from '@/components/features/listings'
import BuildingTypeFilter from '@/components/features/listings/filters/BuildingTypeFilter'
import BottomSheet from '@/components/layout/modal/bottom/BottomSheet'
import type {
  AreaFilter,
  DirectionFilter,
  FloorFilter,
  PriceFilter,
  RoomCountFilter,
} from '@/types/filter'
import type { BuildingType } from '@/types/models/listing'

interface SearchFiltersBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  filters: {
    price?: PriceFilter
    area?: AreaFilter
    roomCount?: RoomCountFilter
    floor?: FloorFilter
    direction?: DirectionFilter
    buildingType?: BuildingType | 'all'
  }
  onFiltersChange: (filters: {
    price?: PriceFilter
    area?: AreaFilter
    roomCount?: RoomCountFilter
    floor?: FloorFilter
    direction?: DirectionFilter
    buildingType?: BuildingType | 'all'
  }) => void
  onApply: () => void
}

const MIN_AREA = 1
const MAX_AREA = 100

export default function SearchFiltersBottomSheet({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onApply,
}: SearchFiltersBottomSheetProps) {
  const [tempFilters, setTempFilters] = useState(filters)

  React.useEffect(() => {
    if (isOpen) {
      setTempFilters(filters)
    }
  }, [isOpen, filters])

  const handleApply = () => {
    onFiltersChange(tempFilters)
    onApply()
    onClose()
  }

  const handleReset = () => {
    const resetFilters = {
      price: {
        deposit: { min: 0, max: null },
        rent: { min: 0, max: null },
        maintenance: { min: 0, max: null },
      },
      area: { min: MIN_AREA, max: MAX_AREA + 1 },
      roomCount: 'all' as RoomCountFilter,
      floor: 'all' as FloorFilter,
      direction: 'all' as DirectionFilter,
      buildingType: 'all' as BuildingType | 'all',
    }
    setTempFilters(resetFilters)
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} fixedHeight={500} expandable={false}>
      {isOpen && (
        <div key={`search-filters-${isOpen}`} className="flex flex-col pb-6">
          <div className="space-y-3 pb-4">
            {/* 금액 필터 */}
            <div className="border-b-8 border-gray-200">
              <PriceFilterComponent
                selectedPrice={
                  tempFilters.price || {
                    deposit: { min: 0, max: null },
                    rent: { min: 0, max: null },
                    maintenance: { min: 0, max: null },
                  }
                }
                onPriceChange={price => setTempFilters({ ...tempFilters, price })}
                onApply={() => {}}
                showButtons={false}
              />
            </div>

            {/* 면적 필터 */}
            <AreaFilterComponent
              areaFilter={tempFilters.area || { min: MIN_AREA, max: MAX_AREA + 1 }}
              onAreaChange={area => setTempFilters({ ...tempFilters, area })}
              maxLimit={MAX_AREA}
              minLimit={MIN_AREA}
            />

            {/* 방 개수 필터 */}
            <div className="border-b-8 border-gray-200">
              <RoomCountFilterComponent
                selectedRoomCount={tempFilters.roomCount || 'all'}
                onRoomCountChange={roomCount => setTempFilters({ ...tempFilters, roomCount })}
              />
            </div>

            {/* 층수 필터 */}
            <FloorFilterComponent
              selectedFloor={tempFilters.floor || 'all'}
              onFloorChange={floor => setTempFilters({ ...tempFilters, floor })}
            />

            {/* 해방향 필터 */}
            <DirectionFilterComponent
              selectedDirection={tempFilters.direction || 'all'}
              onDirectionChange={direction => setTempFilters({ ...tempFilters, direction })}
            />

            {/* 건물 타입 필터 */}
            <div className="border-b-8 border-gray-200 px-6 pb-4">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-900">건물 타입</h3>
              </div>

              <div className="flex flex-row flex-wrap gap-2">
                {(['all', 'ROOM', 'APARTMENT', 'HOUSE', 'OFFICETEL'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setTempFilters({ ...tempFilters, buildingType: type })}
                    className={`rounded-full border-2 px-3 py-1 text-xs font-medium transition-all ${
                      (tempFilters.buildingType || 'all') === type
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {type === 'all'
                      ? '전체'
                      : type === 'ROOM'
                        ? '원투룸'
                        : type === 'APARTMENT'
                          ? '아파트'
                          : type === 'HOUSE'
                            ? '주택/빌라'
                            : '오피스텔'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex gap-2 px-6">
            <button
              onClick={handleReset}
              className="flex-1 rounded-lg border border-gray-300 bg-white py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              초기화
            </button>
            <button
              onClick={handleApply}
              className="flex-1 rounded-lg bg-blue-600 py-3 text-sm font-medium text-white hover:bg-blue-700"
            >
              적용
            </button>
          </div>
        </div>
      )}
    </BottomSheet>
  )
}
