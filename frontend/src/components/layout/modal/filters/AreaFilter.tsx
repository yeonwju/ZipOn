'use client'

import { Slider } from '@mui/material'
import React from 'react'

import type { AreaFilter } from '@/types/filter'

interface AreaFilterProps {
  areaFilter: AreaFilter
  onAreaChange: (area: AreaFilter) => void
  maxLimit: number
  minLimit: number
}

/**
 * 면적 필터 컴포넌트
 * 평형수 기준으로 최소 1평, 최대 100평 (끝은 무제한), 1평 단위
 */
export default function AreaFilter({
  areaFilter,
  onAreaChange,
  maxLimit,
  minLimit,
}: AreaFilterProps) {
  const isUnlimited = areaFilter.max >= maxLimit
  const maxValue = isUnlimited ? maxLimit : areaFilter.max

  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      return
    }
    const [newMin, newMax] = newValue

    // 최대값이 maxLimit에 도달하면 무제한으로 설정, 아니면 해당 값으로 설정
    const newMaxValue = newMax >= maxLimit ? maxLimit + 1 : newMax
    onAreaChange({ min: newMin, max: newMaxValue })
  }

  return (
    <div className="border-b-8 border-gray-200 px-6">
      <div className="mb-4">
        {/* 헤더 */}
        <div className="">
          <h3 className="text-sm font-semibold text-gray-900">면적</h3>
        </div>

        {/* MUI Slider */}
        <div>
          <Slider
            value={[areaFilter.min, maxValue]}
            size={'small'}
            min={minLimit}
            max={maxLimit}
            step={1}
            onChange={handleSliderChange}
            valueLabelDisplay="off"
          />

          {/* 라벨 */}
          <div className="flex justify-between text-xs text-gray-500">
            <span>{areaFilter.min}평</span>
            <span>{isUnlimited ? '무제한' : `${areaFilter.max}평`}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
