'use client'

import Image from 'next/image'
import React from 'react'

import type { BuildingType } from '@/types/models/listing'

import BottomSheet from './BottomSheet'

interface BuildingTypeBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  selectedType: BuildingType
  onSelectType: (type: BuildingType) => void
}

const BUILDING_TYPES: {
  type: BuildingType
  label: string
  icon: string
}[] = [
  {
    type: 'room',
    label: '원투룸',
    icon: '/icons/room.svg',
  },
  {
    type: 'apartment',
    label: '아파트',
    icon: '/icons/apartment.svg',
  },
  {
    type: 'house',
    label: '주택/빌라',
    icon: '/icons/house.svg',
  },
  {
    type: 'officetel',
    label: '오피스텔',
    icon: '/icons/officetel.svg',
  },
]

/**
 * 건물 타입 선택 바텀 시트 컴포넌트
 *
 * 공통 BottomSheet를 사용하여 건물 타입을 선택합니다.
 * 고정 높이로 표시됩니다.
 */
export default function BuildingTypeBottomSheet({
  isOpen,
  onClose,
  selectedType,
  onSelectType,
}: BuildingTypeBottomSheetProps) {
  const handleSelect = (type: BuildingType) => {
    onSelectType(type)
    onClose()
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} fixedHeight={250} expandable={false}>
      <div className="px-3 pt-1">
        <h2 className="mt-1 mb-0.5 text-lg font-bold text-gray-900">건물 유형 선택</h2>
        <p className="mb-2 text-sm text-gray-500">원하는 건물 유형을 선택하세요</p>

        <div className={'flex flex-row gap-1'}>
          {BUILDING_TYPES.map(buildingType => (
            <button
              key={buildingType.type}
              onClick={() => handleSelect(buildingType.type)}
              className={`flex w-full flex-col items-center rounded-xl border-2 p-2 transition-all ${
                selectedType === buildingType.type
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                  selectedType === buildingType.type ? 'bg-blue-100' : 'bg-gray-100'
                }`}
              >
                <Image
                  src={buildingType.icon}
                  width={24}
                  height={24}
                  alt={buildingType.label}
                  className={selectedType === buildingType.type ? 'opacity-100' : 'opacity-60'}
                />
              </div>

              <div className="flex-1 text-left">
                <div className="flex items-center">
                  <span
                    className={`mt-0.5 text-sm font-semibold ${
                      selectedType === buildingType.type ? 'text-blue-600' : 'text-gray-900'
                    }`}
                  >
                    {buildingType.label}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </BottomSheet>
  )
}
