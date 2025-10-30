'use client'

import React from 'react'

import type { FloorFilter } from '@/types/filter'

import BottomSheet from './BottomSheet'

interface FloorFilterBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  selectedFloor: FloorFilter
  onSelectFloor: (floor: FloorFilter) => void
}

const FLOOR_OPTIONS: {
  value: FloorFilter
  label: string
  description: string
}[] = [
  {
    value: 'basement',
    label: '지하',
    description: '반지하, 지하',
  },
  {
    value: 1,
    label: '1층',
    description: '1층만',
  },
  {
    value: 2,
    label: '2층',
    description: '2층만',
  },
  {
    value: '2+',
    label: '2층 이상',
    description: '3층 이상 포함',
  },
]

export default function FloorFilterBottomSheet({
  isOpen,
  onClose,
  selectedFloor,
  onSelectFloor,
}: FloorFilterBottomSheetProps) {
  const handleSelect = (floor: FloorFilter) => {
    onSelectFloor(floor)
    onClose()
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} fixedHeight={420}>
      <div className="px-6 pb-6">
        <h2 className="mb-1 text-lg font-bold text-gray-900">층수 선택</h2>
        <p className="mb-6 text-sm text-gray-500">원하는 층수를 선택하세요</p>

        <div className="space-y-3">
          {FLOOR_OPTIONS.map(option => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`flex w-full items-center justify-between rounded-xl border-2 p-4 transition-all ${
                selectedFloor === option.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex flex-col items-start">
                <span
                  className={`text-lg font-semibold ${
                    selectedFloor === option.value ? 'text-blue-600' : 'text-gray-900'
                  }`}
                >
                  {option.label}
                </span>
                <span className="text-sm text-gray-500">{option.description}</span>
              </div>

              {selectedFloor === option.value && (
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

