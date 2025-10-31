'use client'

import React from 'react'

import type { DirectionFilter } from '@/types/filter'

interface DirectionFilterProps {
  selectedDirection: DirectionFilter
  onDirectionChange: (direction: DirectionFilter) => void
}

const DIRECTION_OPTIONS: { value: DirectionFilter; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'east', label: '동향' },
  { value: 'west', label: '서향' },
  { value: 'south', label: '남향' },
  { value: 'north', label: '북향' },
]

export default function DirectionFilter({
  selectedDirection,
  onDirectionChange,
}: DirectionFilterProps) {
  return (
    <div className="border-b-8 border-gray-200 px-6 pb-4">
      <div className="mb-4">
        <h3 className="text-base font-medium text-gray-900">해방향</h3>
      </div>
      <div className="flex flex-row gap-2">
        {DIRECTION_OPTIONS.map(option => (
          <button
            key={option.value}
            onClick={() => onDirectionChange(option.value)}
            className={`rounded-full border-2 px-3 py-1 text-xs font-medium transition-all ${
              selectedDirection === option.value
                ? 'border-blue-500 bg-blue-500 text-white'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
            }`}
          >
            <span>{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
