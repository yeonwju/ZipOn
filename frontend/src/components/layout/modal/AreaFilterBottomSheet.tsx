'use client'

import React, { useState } from 'react'

import type { AreaFilter } from '@/types/filter'

import BottomSheet from './BottomSheet'

interface AreaFilterBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  selectedArea: AreaFilter
  onSelectArea: (area: AreaFilter) => void
}

/**
 * 면적 단위 계산 (평 기준)
 * - 20평 미만: 1평 단위
 * - 20평 이상: 5평 단위
 */
const getNextArea = (current: number, isIncrease: boolean): number => {
  if (current < 20) {
    return isIncrease ? Math.min(80, current + 1) : Math.max(0, current - 1)
  } else {
    return isIncrease ? Math.min(80, current + 5) : Math.max(20, current - 5)
  }
}

export default function AreaFilterBottomSheet({
  isOpen,
  onClose,
  selectedArea,
  onSelectArea,
}: AreaFilterBottomSheetProps) {
  const [tempMin, setTempMin] = useState(selectedArea.min)
  const [tempMax, setTempMax] = useState(selectedArea.max)

  const handleApply = () => {
    onSelectArea({ min: tempMin, max: tempMax })
    onClose()
  }

  const handleReset = () => {
    setTempMin(0)
    setTempMax(80)
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} fixedHeight={420}>
      <div className="px-6 pb-6">
        <h2 className="mb-1 text-lg font-bold text-gray-900">면적 설정</h2>
        <p className="mb-6 text-sm text-gray-500">최소 면적과 최대 면적을 설정하세요 (평 기준)</p>

        {/* 최소 면적 */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-gray-700">최소 면적</label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setTempMin(getNextArea(tempMin, false))}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-lg font-bold text-gray-700 hover:bg-gray-50"
            >
              -
            </button>
            <div className="flex-1 text-center text-xl font-bold text-blue-600">
              {tempMin}평
            </div>
            <button
              onClick={() => setTempMin(getNextArea(tempMin, true))}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-lg font-bold text-gray-700 hover:bg-gray-50"
            >
              +
            </button>
          </div>
          <div className="mt-1 text-center text-xs text-gray-500">
            약 {Math.round(tempMin * 3.3)}㎡
          </div>
        </div>

        {/* 최대 면적 */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-gray-700">최대 면적</label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setTempMax(getNextArea(tempMax, false))}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-lg font-bold text-gray-700 hover:bg-gray-50"
            >
              -
            </button>
            <div className="flex-1 text-center text-xl font-bold text-blue-600">
              {tempMax}평
            </div>
            <button
              onClick={() => setTempMax(getNextArea(tempMax, true))}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-lg font-bold text-gray-700 hover:bg-gray-50"
            >
              +
            </button>
          </div>
          <div className="mt-1 text-center text-xs text-gray-500">
            약 {Math.round(tempMax * 3.3)}㎡
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex gap-2">
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
    </BottomSheet>
  )
}

