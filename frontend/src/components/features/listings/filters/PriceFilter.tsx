'use client'

import React, { useState } from 'react'

import PriceSlider from '@/components/common/PriceSlider'
import type { PriceFilter } from '@/types/filter'

interface PriceFilterProps {
  selectedPrice: PriceFilter
  onPriceChange: (price: PriceFilter) => void
  onApply: () => void
  onClose?: () => void
  showButtons?: boolean // 버튼 표시 여부 (기본: true)
}

const DEPOSIT_MAX_PRICE = 100000
const RENT_MAX_PRICE = 10000
const SETTING_MAX_PRICE = 1000

export default function PriceFilter({
  selectedPrice,
  onPriceChange,
  onApply,
  onClose,
  showButtons = true,
}: PriceFilterProps) {
  // 버튼이 있을 때만 내부 상태 관리 (AllFiltersBottomSheet에서는 버튼이 없으므로 직접 사용)
  const [tempPrice, setTempPrice] = useState(selectedPrice)

  // 버튼이 있을 때만 selectedPrice가 변경되면 tempPrice도 업데이트
  React.useEffect(() => {
    if (showButtons) {
      setTempPrice(selectedPrice)
    }
  }, [selectedPrice, showButtons])

  // showButtons가 false일 때는 selectedPrice를 직접 사용, true일 때는 tempPrice 사용
  const currentPrice = showButtons ? tempPrice : selectedPrice

  // 보증금 슬라이더 변경 핸들러
  const handleDepositChange = (_event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      return
    }
    const [newMin, newMax] = newValue
    const maxValue = newMax === DEPOSIT_MAX_PRICE ? null : newMax
    const newPrice = {
      ...currentPrice,
      deposit: { min: newMin, max: maxValue },
    }
    if (showButtons) {
      setTempPrice(newPrice)
    }
    onPriceChange(newPrice)
  }

  // 월세 슬라이더 변경 핸들러
  const handleRentChange = (_event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      return
    }
    const [newMin, newMax] = newValue
    const maxValue = newMax === RENT_MAX_PRICE ? null : newMax
    const newPrice = {
      ...currentPrice,
      rent: { min: newMin, max: maxValue },
    }
    if (showButtons) {
      setTempPrice(newPrice)
    }
    onPriceChange(newPrice)
  }

  // 관리비 슬라이더 변경 핸들러
  const handleMaintenanceChange = (_event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      return
    }
    const [newMin, newMax] = newValue
    const maxValue = newMax === SETTING_MAX_PRICE ? null : newMax
    const newPrice = {
      ...currentPrice,
      maintenance: { min: newMin, max: maxValue },
    }
    if (showButtons) {
      setTempPrice(newPrice)
    }
    onPriceChange(newPrice)
  }

  const handleApply = () => {
    console.log('=== 금액 필터 적용 ===')
    console.log('보증금:', {
      최소: `${tempPrice.deposit.min}만원`,
      최대: tempPrice.deposit.max === null ? '무제한' : `${tempPrice.deposit.max}만원`,
    })
    console.log('월세:', {
      최소: `${tempPrice.rent.min}만원`,
      최대: tempPrice.rent.max === null ? '무제한' : `${tempPrice.rent.max}만원`,
    })
    console.log('관리비:', {
      최소: `${tempPrice.maintenance.min}만원`,
      최대: tempPrice.maintenance.max === null ? '무제한' : `${tempPrice.maintenance.max}만원`,
    })
    console.log('원본 데이터:', tempPrice)
    console.log('==================')

    onPriceChange(tempPrice)
    onApply()
    if (onClose) {
      onClose()
    }
  }

  const handleReset = () => {
    setTempPrice({
      deposit: { min: 0, max: null },
      rent: { min: 0, max: 1000 },
      maintenance: { min: 0, max: null },
    })
  }

  return (
    <div className="flex flex-col gap-2 px-6 pb-4">
      {/* 슬라이더 영역 */}
      <div>
        <PriceSlider
          label="보증금"
          min={currentPrice.deposit.min}
          max={currentPrice.deposit.max}
          maxLimit={DEPOSIT_MAX_PRICE}
          onChange={handleDepositChange}
        />
        <PriceSlider
          label="월세"
          min={currentPrice.rent.min}
          max={currentPrice.rent.max}
          maxLimit={RENT_MAX_PRICE}
          onChange={handleRentChange}
        />
        <PriceSlider
          label="관리비"
          min={currentPrice.maintenance.min}
          max={currentPrice.maintenance.max}
          maxLimit={SETTING_MAX_PRICE}
          onChange={handleMaintenanceChange}
        />
        {showButtons && (
          <div className="mt-4 flex gap-2">
            <button
              onClick={handleReset}
              className="flex-1 rounded-lg border border-gray-300 bg-white py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              초기화
            </button>
            <button
              onClick={handleApply}
              className="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              적용
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
