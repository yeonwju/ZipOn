'use client'

import React, { useState } from 'react'

import PriceSlider from '@/components/common/PriceSlider'
import type { PriceFilter } from '@/types/filter'

import BottomSheet from './BottomSheet'

interface PriceFilterBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  selectedPrice: PriceFilter
  onSelectPrice: (price: PriceFilter) => void
}

type TabType = 'deposit' | 'rent' | 'maintenance'

const TABS: { key: TabType; label: string }[] = [
  { key: 'deposit', label: '보증금' },
  { key: 'rent', label: '월세' },
  { key: 'maintenance', label: '관리비' },
]

const MAX_PRICE = 100000 // 10억

function PriceFilterContent({
  selectedPrice,
  onSelectPrice,
  onClose,
}: {
  selectedPrice: PriceFilter
  onSelectPrice: (price: PriceFilter) => void
  onClose: () => void
}) {
  // 매번 새로운 인스턴스가 생성되므로 항상 selectedPrice로 초기화됨
  const [tempPrice, setTempPrice] = useState(selectedPrice)
  const [activeTab, setActiveTab] = useState<TabType>('deposit')

  const handleApply = () => {
    onSelectPrice(tempPrice)
    onClose()
  }

  const handleReset = () => {
    setTempPrice({
      deposit: { min: 0, max: null },
      rent: { min: 0, max: null },
      maintenance: { min: 0, max: null },
    })
  }

  const handleMinChange = (type: TabType, value: number) => {
    setTempPrice(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        min: value,
      },
    }))
  }

  const handleMaxChange = (type: TabType, value: number | null) => {
    setTempPrice(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        max: value,
      },
    }))
  }

  return (
    <div className="flex h-full flex-col px-6 pb-6">
      <h2 className="mb-1 text-lg font-bold text-gray-900">금액 설정</h2>
      <p className="mb-4 text-sm text-gray-500">원하는 금액 범위를 설정하세요</p>

      {/* 탭 */}
      <div className="mb-6 flex gap-2">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 슬라이더 영역 */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'deposit' && (
          <PriceSlider
            label="보증금(전세금)"
            min={tempPrice.deposit.min}
            max={tempPrice.deposit.max}
            maxLimit={MAX_PRICE}
            onMinChange={value => handleMinChange('deposit', value)}
            onMaxChange={value => handleMaxChange('deposit', value)}
          />
        )}
        {activeTab === 'rent' && (
          <PriceSlider
            label="월세"
            min={tempPrice.rent.min}
            max={tempPrice.rent.max}
            maxLimit={MAX_PRICE}
            onMinChange={value => handleMinChange('rent', value)}
            onMaxChange={value => handleMaxChange('rent', value)}
          />
        )}
        {activeTab === 'maintenance' && (
          <PriceSlider
            label="관리비"
            min={tempPrice.maintenance.min}
            max={tempPrice.maintenance.max}
            maxLimit={MAX_PRICE}
            onMinChange={value => handleMinChange('maintenance', value)}
            onMaxChange={value => handleMaxChange('maintenance', value)}
          />
        )}
      </div>

      {/* 버튼 */}
      <div className="flex gap-2 pt-4">
        <button
          onClick={handleReset}
          className="flex-1 rounded-lg border border-gray-300 bg-white py-3 font-medium text-gray-700 hover:bg-gray-50"
        >
          초기화
        </button>
        <button
          onClick={handleApply}
          className="flex-1 rounded-lg bg-blue-600 py-3 font-medium text-white hover:bg-blue-700"
        >
          적용
        </button>
      </div>
    </div>
  )
}

export default function PriceFilterBottomSheet({
  isOpen,
  onClose,
  selectedPrice,
  onSelectPrice,
}: PriceFilterBottomSheetProps) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} fixedHeight={500} expandable={false}>
      {/* key를 사용하여 모달이 열릴 때마다 컴포넌트를 리마운트하여 상태 초기화 */}
      {isOpen && (
        <PriceFilterContent
          key={`price-filter-${isOpen}`}
          selectedPrice={selectedPrice}
          onSelectPrice={onSelectPrice}
          onClose={onClose}
        />
      )}
    </BottomSheet>
  )
}
