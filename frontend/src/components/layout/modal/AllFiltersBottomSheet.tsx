'use client'

import '@/styles/range-slider.css'

import React, { useState } from 'react'

import PriceSlider from '@/components/common/PriceSlider'
import type { AreaFilter, DirectionFilter, FloorFilter, PriceFilter, RoomCountFilter } from '@/types/filter'

import BottomSheet from './BottomSheet'

interface AllFiltersBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  priceFilter: PriceFilter
  roomCountFilter: RoomCountFilter
  areaFilter: AreaFilter
  floorFilter: FloorFilter
  directionFilter: DirectionFilter
  onPriceChange: (price: PriceFilter) => void
  onRoomCountChange: (count: RoomCountFilter) => void
  onAreaChange: (area: AreaFilter) => void
  onFloorChange: (floor: FloorFilter) => void
  onDirectionChange: (direction: DirectionFilter) => void
  onResetFilters: () => void
  onApplyFilters: () => void
}

type FilterSection = 'price' | 'roomCount' | 'area' | 'floor' | 'direction'

const ROOM_COUNT_OPTIONS: { value: RoomCountFilter; label: string }[] = [
  { value: 1, label: '1개' },
  { value: 2, label: '2개' },
  { value: 3, label: '3개' },
  { value: '3+', label: '3개 이상' },
]

const FLOOR_OPTIONS: { value: FloorFilter; label: string }[] = [
  { value: 'B1', label: '지하' },
  { value: 1, label: '1층' },
  { value: 2, label: '2층' },
  { value: '2+', label: '2층 이상' },
]

const DIRECTION_OPTIONS: { value: DirectionFilter; label: string; icon: string }[] = [
  { value: 'east', label: '동향', icon: '☀️' },
  { value: 'west', label: '서향', icon: '🌅' },
  { value: 'south', label: '남향', icon: '🌞' },
  { value: 'north', label: '북향', icon: '❄️' },
  { value: 'northwest', label: '북서향', icon: '🌬️' },
]

const MAX_PRICE = 100000
const MAX_AREA = 80

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
  const [expandedSection, setExpandedSection] = useState<FilterSection | null>(null)

  const toggleSection = (section: FilterSection) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} fixedHeight={650} expandable={false}>
      <div className="flex h-full flex-col px-6 pb-6">
        <h2 className="mb-1 text-lg font-bold text-gray-900">전체 필터</h2>
        <p className="mb-4 text-sm text-gray-500">원하는 필터를 선택하세요</p>

        <div className="flex-1 space-y-3 overflow-y-auto">
          {/* 금액 필터 */}
          <div className="rounded-lg border border-gray-200 bg-white">
            <button
              onClick={() => toggleSection('price')}
              className="flex w-full items-center justify-between p-4"
            >
              <span className="text-base font-medium text-gray-900">금액</span>
              <span className="text-sm text-gray-500">
                {expandedSection === 'price' ? '▲' : '▼'}
              </span>
            </button>
            {expandedSection === 'price' && (
              <div className="border-t border-gray-200 p-4">
                <PriceSlider
                  label="보증금"
                  min={priceFilter.deposit.min}
                  max={priceFilter.deposit.max}
                  maxLimit={MAX_PRICE}
                  onMinChange={value =>
                    onPriceChange({
                      ...priceFilter,
                      deposit: { ...priceFilter.deposit, min: value },
                    })
                  }
                  onMaxChange={value =>
                    onPriceChange({
                      ...priceFilter,
                      deposit: { ...priceFilter.deposit, max: value },
                    })
                  }
                />
                <PriceSlider
                  label="월세"
                  min={priceFilter.rent.min}
                  max={priceFilter.rent.max}
                  maxLimit={MAX_PRICE}
                  onMinChange={value =>
                    onPriceChange({ ...priceFilter, rent: { ...priceFilter.rent, min: value } })
                  }
                  onMaxChange={value =>
                    onPriceChange({ ...priceFilter, rent: { ...priceFilter.rent, max: value } })
                  }
                />
                <PriceSlider
                  label="관리비"
                  min={priceFilter.maintenance.min}
                  max={priceFilter.maintenance.max}
                  maxLimit={MAX_PRICE}
                  onMinChange={value =>
                    onPriceChange({
                      ...priceFilter,
                      maintenance: { ...priceFilter.maintenance, min: value },
                    })
                  }
                  onMaxChange={value =>
                    onPriceChange({
                      ...priceFilter,
                      maintenance: { ...priceFilter.maintenance, max: value },
                    })
                  }
                />
              </div>
            )}
          </div>

          {/* 방 개수 필터 */}
          <div className="rounded-lg border border-gray-200 bg-white">
            <button
              onClick={() => toggleSection('roomCount')}
              className="flex w-full items-center justify-between p-4"
            >
              <span className="text-base font-medium text-gray-900">방 개수</span>
              <span className="text-sm text-gray-500">
                {expandedSection === 'roomCount' ? '▲' : '▼'}
              </span>
            </button>
            {expandedSection === 'roomCount' && (
              <div className="border-t border-gray-200 p-4">
                <div className="grid grid-cols-2 gap-2">
                  {ROOM_COUNT_OPTIONS.map(option => (
                    <button
                      key={option.value}
                      onClick={() => onRoomCountChange(option.value)}
                      className={`rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${
                        roomCountFilter === option.value
                          ? 'border-blue-500 bg-blue-50 text-blue-600'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 면적 필터 */}
          <div className="rounded-lg border border-gray-200 bg-white">
            <button
              onClick={() => toggleSection('area')}
              className="flex w-full items-center justify-between p-4"
            >
              <span className="text-base font-medium text-gray-900">면적</span>
              <span className="text-sm text-gray-500">
                {expandedSection === 'area' ? '▲' : '▼'}
              </span>
            </button>
            {expandedSection === 'area' && (
              <div className="border-t border-gray-200 p-4">
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    최소 면적: {areaFilter.min}평
                  </label>
                  <input
                    type="range"
                    min="0"
                    max={MAX_AREA}
                    step="1"
                    value={areaFilter.min}
                    onChange={e => onAreaChange({ ...areaFilter, min: Number(e.target.value) })}
                    className="price-slider w-full"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    최대 면적: {areaFilter.max}평
                  </label>
                  <input
                    type="range"
                    min="0"
                    max={MAX_AREA}
                    step="1"
                    value={areaFilter.max}
                    onChange={e => onAreaChange({ ...areaFilter, max: Number(e.target.value) })}
                    className="price-slider w-full"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 층수 필터 */}
          <div className="rounded-lg border border-gray-200 bg-white">
            <button
              onClick={() => toggleSection('floor')}
              className="flex w-full items-center justify-between p-4"
            >
              <span className="text-base font-medium text-gray-900">층수</span>
              <span className="text-sm text-gray-500">
                {expandedSection === 'floor' ? '▲' : '▼'}
              </span>
            </button>
            {expandedSection === 'floor' && (
              <div className="border-t border-gray-200 p-4">
                <div className="grid grid-cols-2 gap-2">
                  {FLOOR_OPTIONS.map(option => (
                    <button
                      key={option.value}
                      onClick={() => onFloorChange(option.value)}
                      className={`rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${
                        floorFilter === option.value
                          ? 'border-blue-500 bg-blue-50 text-blue-600'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 해방향 필터 */}
          <div className="rounded-lg border border-gray-200 bg-white">
            <button
              onClick={() => toggleSection('direction')}
              className="flex w-full items-center justify-between p-4"
            >
              <span className="text-base font-medium text-gray-900">해방향</span>
              <span className="text-sm text-gray-500">
                {expandedSection === 'direction' ? '▲' : '▼'}
              </span>
            </button>
            {expandedSection === 'direction' && (
              <div className="border-t border-gray-200 p-4">
                <div className="grid grid-cols-2 gap-2">
                  {DIRECTION_OPTIONS.map(option => (
                    <button
                      key={option.value}
                      onClick={() => onDirectionChange(option.value)}
                      className={`flex items-center gap-2 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${
                        directionFilter === option.value
                          ? 'border-blue-500 bg-blue-50 text-blue-600'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <span>{option.icon}</span>
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 버튼 */}
        <div className="mt-4 flex gap-3">
          <button
            onClick={onResetFilters}
            className="flex-1 rounded-lg border border-gray-300 py-3 text-base font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            초기화
          </button>
          <button
            onClick={onApplyFilters}
            className="flex-1 rounded-lg bg-blue-600 py-3 text-base font-semibold text-white transition-colors hover:bg-blue-700"
          >
            적용
          </button>
        </div>
      </div>
    </BottomSheet>
  )
}
