'use client'

import '@/styles/range-slider.css'

import React from 'react'

interface PriceSliderProps {
  label: string
  min: number
  max: number | null
  maxLimit: number
  onMinChange: (value: number) => void
  onMaxChange: (value: number | null) => void
}

/**
 * 금액을 보기 좋게 포맷
 */
const formatPrice = (price: number): string => {
  if (price === 0) return '최소'
  if (price >= 10000) {
    const uk = Math.floor(price / 10000)
    const man = price % 10000
    if (man === 0) return `${uk}억원`
    return `${uk}억 ${man.toLocaleString()}만원`
  }
  return `${price.toLocaleString()}만원`
}

export default function PriceSlider({
  label,
  min,
  max,
  maxLimit,
  onMinChange,
  onMaxChange,
}: PriceSliderProps) {
  const maxValue = max ?? maxLimit
  const minPercent = (min / maxLimit) * 100
  const maxPercent = (maxValue / maxLimit) * 100

  const handleUnlimited = () => {
    onMaxChange(null)
  }

  const handleSetMax = () => {
    if (max === null) {
      onMaxChange(min + 1000)
    }
  }

  return (
    <div className="mb-8">
      {/* 헤더 */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">{label}</h3>
        <button
          onClick={max === null ? handleSetMax : handleUnlimited}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          {max === null ? '최대 금액 설정' : '무제한'}
        </button>
      </div>

      {/* 슬라이더 컨테이너 */}
      <div className="relative px-2 pb-8 pt-2">
        {/* 트랙 배경 */}
        <div className="absolute left-2 right-2 top-6 h-1 rounded-full bg-gray-200" />

        {/* 선택된 범위 트랙 */}
        <div
          className="absolute top-6 h-1 rounded-full bg-blue-500"
          style={{
            left: `calc(0.5rem + ${minPercent}%)`,
            right: `calc(0.5rem + ${100 - maxPercent}%)`,
          }}
        />

        {/* 최소값 슬라이더 */}
        <input
          type="range"
          min="0"
          max={maxLimit}
          step="100"
          value={min}
          onChange={e => onMinChange(Number(e.target.value))}
          className="price-slider absolute left-0 top-0 h-12 w-full cursor-pointer appearance-none bg-transparent"
          style={{
            zIndex: min > maxValue - 1000 ? 5 : 3,
          }}
        />

        {/* 최대값 슬라이더 */}
        <input
          type="range"
          min="0"
          max={maxLimit}
          step="100"
          value={maxValue}
          onChange={e => onMaxChange(Number(e.target.value))}
          disabled={max === null}
          className="price-slider absolute left-0 top-0 h-12 w-full cursor-pointer appearance-none bg-transparent"
          style={{
            zIndex: 4,
          }}
        />

        {/* 라벨 */}
        <div className="relative mt-8 flex justify-between text-xs text-gray-500">
          <span>{formatPrice(min)}</span>
          <span>{max === null ? '무제한' : formatPrice(maxValue)}</span>
        </div>
      </div>
    </div>
  )
}

