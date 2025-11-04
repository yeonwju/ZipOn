'use client'

import React from 'react'

import type { FloorFilter } from '@/types/filter'

interface FloorFilterProps {
  selectedFloor: FloorFilter
  onFloorChange: (floor: FloorFilter) => void
}

const FLOOR_OPTIONS: { value: FloorFilter; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'B1', label: '지하' },
  { value: 1, label: '1층' },
  { value: 2, label: '2층' },
  { value: '2+', label: '2층 이상' },
]

export default function FloorFilter({ selectedFloor, onFloorChange }: FloorFilterProps) {
  return (
    <div className="border-b-8 border-gray-200 px-6 pb-4">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-900">층수</h3>
      </div>
      <div className="flex flex-row gap-2">
        {FLOOR_OPTIONS.map(option => (
          <button
            key={option.value}
            onClick={() => onFloorChange(option.value)}
            className={`rounded-full border-2 px-3 py-1 text-xs font-medium transition-all ${
              selectedFloor === option.value
                ? 'border-blue-500 bg-blue-500 text-white'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}
