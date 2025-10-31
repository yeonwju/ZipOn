'use client'

import { Slider } from '@mui/material'

interface PriceSliderProps {
  label: string
  min: number
  max: number | null
  maxLimit: number
  onMinChange?: (value: number) => void
  onMaxChange?: (value: number | null) => void
  onChange?: (event: Event, value: number | number[]) => void
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
  onChange,
}: PriceSliderProps) {
  const maxValue = max ?? maxLimit

  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      return
    }

    // onChange가 제공되면 직접 사용 (면적 필터처럼)
    if (onChange) {
      onChange(_event, newValue)
      return
    }

    // 기존 방식 (onMinChange, onMaxChange 사용)
    const [newMin, newMax] = newValue

    if (onMinChange) {
      onMinChange(newMin)
    }
    // 최대값이 maxLimit에 도달하면 무제한으로 설정, 아니면 해당 값으로 설정
    if (onMaxChange) {
      onMaxChange(newMax === maxLimit ? null : newMax)
    }
  }

  return (
    <div className="mb-4">
      {/* 헤더 */}
      <div className="">
        <h3 className="text-sm font-semibold text-gray-900">{label}</h3>
      </div>

      {/* MUI Slider */}
      <div>
        <Slider
          value={[min, maxValue]}
          size={'small'}
          min={0}
          max={maxLimit}
          step={100}
          onChange={handleSliderChange}
          valueLabelDisplay="off"
        />

        {/* 라벨 */}
        <div className="flex justify-between text-xs text-gray-500">
          <span>{formatPrice(min)}</span>
          <span>{max === null ? '무제한' : formatPrice(maxValue)}</span>
        </div>
      </div>
    </div>
  )
}
