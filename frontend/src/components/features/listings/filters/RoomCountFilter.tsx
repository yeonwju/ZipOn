'use client'

import React from 'react'

import type { RoomCountFilter } from '@/types/filter'

interface RoomCountFilterProps {
  selectedRoomCount: RoomCountFilter
  onRoomCountChange: (roomCount: RoomCountFilter) => void
}

const ROOM_COUNT_OPTIONS: { value: RoomCountFilter; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 1, label: '1개' },
  { value: 2, label: '2개' },
  { value: 3, label: '3개' },
  { value: '3+', label: '3개 이상' },
]

export default function RoomCountFilter({
  selectedRoomCount,
  onRoomCountChange,
}: RoomCountFilterProps) {
  // undefined인 경우 'all'로 표시
  const displayValue = selectedRoomCount ?? 'all'

  return (
    <div className="px-6 pb-6">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-900">방 개수</h3>
      </div>
      <div className="flex flex-row flex-wrap gap-2">
        {ROOM_COUNT_OPTIONS.map(option => (
          <button
            key={option.value}
            onClick={() => onRoomCountChange(option.value)}
            className={`rounded-full border-2 px-3 py-1 text-xs font-medium transition-all ${
              displayValue === option.value
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
