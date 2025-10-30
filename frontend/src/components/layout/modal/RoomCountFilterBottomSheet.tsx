'use client'

import React from 'react'

import type { RoomCountFilter } from '@/types/filter'

import BottomSheet from './BottomSheet'

interface RoomCountFilterBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  selectedRoomCount: RoomCountFilter
  onSelectRoomCount: (roomCount: RoomCountFilter) => void
}

const ROOM_COUNT_OPTIONS: {
  value: RoomCountFilter
  label: string
  description: string
}[] = [
  {
    value: 1,
    label: '1개',
    description: '원룸',
  },
  {
    value: 2,
    label: '2개',
    description: '투룸',
  },
  {
    value: 3,
    label: '3개',
    description: '쓰리룸',
  },
  {
    value: '3+',
    label: '3개 이상',
    description: '넓은 공간',
  },
]

export default function RoomCountFilterBottomSheet({
  isOpen,
  onClose,
  selectedRoomCount,
  onSelectRoomCount,
}: RoomCountFilterBottomSheetProps) {
  const handleSelect = (roomCount: RoomCountFilter) => {
    onSelectRoomCount(roomCount)
    onClose()
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} fixedHeight={420}>
      <div className="px-6 pb-6">
        <h2 className="mb-1 text-lg font-bold text-gray-900">방 개수 선택</h2>
        <p className="mb-6 text-sm text-gray-500">원하는 방 개수를 선택하세요</p>

        <div className="space-y-3">
          {ROOM_COUNT_OPTIONS.map(option => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`flex w-full items-center justify-between rounded-xl border-2 p-4 transition-all ${
                selectedRoomCount === option.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex flex-col items-start">
                <span
                  className={`text-lg font-semibold ${
                    selectedRoomCount === option.value ? 'text-blue-600' : 'text-gray-900'
                  }`}
                >
                  {option.label}
                </span>
                <span className="text-sm text-gray-500">{option.description}</span>
              </div>

              {selectedRoomCount === option.value && (
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

