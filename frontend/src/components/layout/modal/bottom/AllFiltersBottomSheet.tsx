'use client'

import React, { useState } from 'react'

import type {
  AreaFilter,
  DirectionFilter,
  FloorFilter,
  PriceFilter,
  RoomCountFilter,
} from '@/types/filter'

import BottomSheet from './BottomSheet'
import AreaFilterComponent from '@/components/map/filters/AreaFilter'
import DirectionFilterComponent from '@/components/map/filters/DirectionFilter'
import FloorFilterComponent from '@/components/map/filters/FloorFilter'
import PriceFilterComponent from '@/components/map/filters/PriceFilter'
import RoomCountFilterComponent from '@/components/map/filters/RoomCountFilter'

interface AllFiltersBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  priceFilter: PriceFilter
  roomCountFilter: RoomCountFilter
  areaFilter: AreaFilter
  floorFilter: FloorFilter
  directionFilter: DirectionFilter
  onPriceChange: (price: PriceFilter) => void
  onRoomCountChange: (count: RoomCountFilter | undefined) => void
  onAreaChange: (area: AreaFilter) => void
  onFloorChange: (floor: FloorFilter | undefined) => void
  onDirectionChange: (direction: DirectionFilter | undefined) => void
  onResetFilters: () => void
  onApplyFilters: () => void
}

// console.log용 DIRECTION_OPTIONS
const DIRECTION_OPTIONS: { value: DirectionFilter; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'east', label: '동향' },
  { value: 'west', label: '서향' },
  { value: 'south', label: '남향' },
  { value: 'north', label: '북향' },
]

const MAX_AREA = 100 // 면적 최대값: 100평
const MIN_AREA = 1 // 면적 최소값: 1평

export default function AllFiltersBottomSheet({
  isOpen,
  onClose,
  priceFilter,
  roomCountFilter,
  areaFilter,
  floorFilter,
  directionFilter,
  onPriceChange,
  onRoomCountChange,
  onAreaChange,
  onFloorChange,
  onDirectionChange,
  onResetFilters,
  onApplyFilters,
}: AllFiltersBottomSheetProps) {
  // 임시 상태 관리 (모달이 열릴 때마다 초기화)
  const [tempPriceFilter, setTempPriceFilter] = useState(priceFilter)
  const [tempRoomCountFilter, setTempRoomCountFilter] = useState(roomCountFilter)
  const [tempAreaFilter, setTempAreaFilter] = useState(areaFilter)
  const [tempFloorFilter, setTempFloorFilter] = useState(floorFilter)
  const [tempDirectionFilter, setTempDirectionFilter] = useState(directionFilter)

  // isOpen이 변경될 때마다 상태 초기화 (key prop과 함께 사용하여 리마운트)
  React.useEffect(() => {
    if (isOpen) {
      setTempPriceFilter(priceFilter)
      setTempRoomCountFilter(roomCountFilter)
      setTempAreaFilter(areaFilter)
      setTempFloorFilter(floorFilter)
      setTempDirectionFilter(directionFilter)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const handleApply = () => {
    console.log('=== 전체 필터 적용 ===')
    console.log('금액 필터:', {
      보증금: {
        최소: `${tempPriceFilter.deposit.min}만원`,
        최대:
          tempPriceFilter.deposit.max === null ? '무제한' : `${tempPriceFilter.deposit.max}만원`,
      },
      월세: {
        최소: `${tempPriceFilter.rent.min}만원`,
        최대: tempPriceFilter.rent.max === null ? '무제한' : `${tempPriceFilter.rent.max}만원`,
      },
      관리비: {
        최소: `${tempPriceFilter.maintenance.min}만원`,
        최대:
          tempPriceFilter.maintenance.max === null
            ? '무제한'
            : `${tempPriceFilter.maintenance.max}만원`,
      },
    })
    console.log(
      '방 개수:',
      tempRoomCountFilter === 'all'
        ? '전체 (필터 없음)'
        : tempRoomCountFilter === '3+'
          ? '3개 이상'
          : `${tempRoomCountFilter}개`
    )
    const areaMaxText = tempAreaFilter.max >= MAX_AREA ? '무제한' : `${tempAreaFilter.max}평`
    console.log('면적:', `${tempAreaFilter.min}평 ~ ${areaMaxText}`)
    console.log(
      '층수:',
      tempFloorFilter === 'all'
        ? '전체 (필터 없음)'
        : tempFloorFilter === 'B1'
          ? '지하'
          : tempFloorFilter === '2+'
            ? '2층 이상'
            : `${tempFloorFilter}층`
    )
    console.log(
      '해방향:',
      `${DIRECTION_OPTIONS.find(opt => opt.value === tempDirectionFilter)?.label || tempDirectionFilter}`
    )
    console.log('원본 데이터:', {
      priceFilter: tempPriceFilter,
      roomCountFilter: tempRoomCountFilter,
      areaFilter: tempAreaFilter,
      floorFilter: tempFloorFilter,
      directionFilter: tempDirectionFilter,
    })
    console.log('===================')

    onPriceChange(tempPriceFilter)
    // 방 개수: 'all'은 필터 없음을 의미하므로 undefined로 전달
    onRoomCountChange(tempRoomCountFilter === 'all' ? undefined : tempRoomCountFilter)
    onAreaChange(tempAreaFilter)
    // 층수: 'all'은 필터 없음을 의미하므로 undefined로 전달
    onFloorChange(tempFloorFilter === 'all' ? undefined : tempFloorFilter)
    // 해방향: 'all'은 필터 없음을 의미하므로 undefined로 전달
    onDirectionChange(tempDirectionFilter === 'all' ? undefined : tempDirectionFilter)
    onApplyFilters()
  }

  const handleReset = () => {
    const resetPriceFilter: PriceFilter = {
      deposit: { min: 0, max: null },
      rent: { min: 0, max: null },
      maintenance: { min: 0, max: null },
      area: { min: MIN_AREA, max: null },
    }
    setTempPriceFilter(resetPriceFilter)
    setTempRoomCountFilter('all')
    setTempAreaFilter({ min: MIN_AREA, max: MAX_AREA })
    setTempFloorFilter('all')
    setTempDirectionFilter('all')
    onResetFilters()
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} fixedHeight={650} expandable={false}>
      {isOpen && (
        <div key={`all-filters-${isOpen}`} className="flex flex-col pb-6">
          <div className="space-y-3 pb-4">
            {/* 금액 필터 */}
            <div className="border-b-8 border-gray-200">
              <PriceFilterComponent
                selectedPrice={tempPriceFilter}
                onPriceChange={setTempPriceFilter}
                onApply={() => {}} // 버튼 숨김으로 인해 호출되지 않음
                showButtons={false}
              />
            </div>
            {/* 면적 필터 */}
            <AreaFilterComponent
              areaFilter={tempAreaFilter}
              onAreaChange={setTempAreaFilter}
              maxLimit={MAX_AREA}
              minLimit={MIN_AREA}
            />
            {/* 방 개수 필터 */}
            <div className="border-b-8 border-gray-200">
              <RoomCountFilterComponent
                selectedRoomCount={tempRoomCountFilter}
                onRoomCountChange={setTempRoomCountFilter}
              />
            </div>

            {/* 층수 필터 */}
            <FloorFilterComponent
              selectedFloor={tempFloorFilter}
              onFloorChange={setTempFloorFilter}
            />
            {/* 해방향 필터 */}
            <DirectionFilterComponent
              selectedDirection={tempDirectionFilter}
              onDirectionChange={setTempDirectionFilter}
            />
          </div>

          {/* 버튼 */}
          <div className="flex gap-2 px-6">
            <button
              onClick={handleReset}
              className="flex-1 rounded-lg border border-gray-300 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              초기화
            </button>
            <button
              onClick={handleApply}
              className="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              적용
            </button>
          </div>
        </div>
      )}
    </BottomSheet>
  )
}
