'use client'

import React from 'react'

import type { DirectionFilter } from '@/types/filter'

import BottomSheet from './BottomSheet'

interface DirectionFilterBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  selectedDirection: DirectionFilter
  onSelectDirection: (direction: DirectionFilter) => void
}

const DIRECTION_OPTIONS: {
  value: DirectionFilter
  label: string
  description: string
  icon: string
}[] = [
  {
    value: 'east',
    label: '동향',
    description: '아침 햇살',
    icon: '🌅',
  },
  {
    value: 'west',
    label: '서향',
    description: '저녁 햇살',
    icon: '🌇',
  },
  {
    value: 'south',
    label: '남향',
    description: '따뜻한 햇볕',
    icon: '☀️',
  },
  {
    value: 'north',
    label: '북향',
    description: '시원한 그늘',
    icon: '🌙',
  },
  {
    value: 'northwest',
    label: '북서향',
    description: '북쪽과 서쪽 사이',
    icon: '🧭',
  },
]

export default function DirectionFilterBottomSheet({
  isOpen,
  onClose,
  selectedDirection,
  onSelectDirection,
}: DirectionFilterBottomSheetProps) {
  const handleSelect = (direction: DirectionFilter) => {
    onSelectDirection(direction)
    onClose()
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} fixedHeight={500}>
      <div className="px-6 pb-6">
        <h2 className="mb-1 text-lg font-bold text-gray-900">해방향 선택</h2>
        <p className="mb-6 text-sm text-gray-500">원하는 해방향을 선택하세요</p>

        <div className="space-y-3">
          {DIRECTION_OPTIONS.map(option => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`flex w-full items-center gap-4 rounded-xl border-2 p-4 transition-all ${
                selectedDirection === option.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-2xl">
                {option.icon}
              </div>

              <div className="flex flex-1 flex-col items-start">
                <span
                  className={`text-lg font-semibold ${
                    selectedDirection === option.value ? 'text-blue-600' : 'text-gray-900'
                  }`}
                >
                  {option.label}
                </span>
                <span className="text-sm text-gray-500">{option.description}</span>
              </div>

              {selectedDirection === option.value && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500">
                  <svg
                    className="h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </BottomSheet>
  )
}

