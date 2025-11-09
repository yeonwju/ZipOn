'use client'

import Image from 'next/image'
import React from 'react'

import type { BuildingType } from '@/types/models/listing'

import BottomSheet from './BottomSheet'

interface BuildingTypeBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  selectedType: BuildingType | 'all'
  onSelectType: (type: BuildingType | 'all') => void
}

interface BuildingTypeOption {
  type: BuildingType | 'all'
  label: string
  icon?: string
}

const buildingTypesIcons: BuildingTypeOption[] = [
  { type: 'all', label: '전체' },
  { type: 'ROOM', label: '원투룸', icon: '/icons/room.svg' },
  { type: 'APARTMENT', label: '아파트', icon: '/icons/apartment.svg' },
  { type: 'HOUSE', label: '주택/빌라', icon: '/icons/house.svg' },
  { type: 'OFFICETEL', label: '오피스텔', icon: '/icons/officetel.svg' },
]

const buildingTypesWhiteIcons: BuildingTypeOption[] = [
  { type: 'all', label: '전체' },
  { type: 'ROOM', label: '원투룸', icon: '/icons/room-white.svg' },
  { type: 'APARTMENT', label: '아파트', icon: '/icons/apartment-white.svg' },
  { type: 'HOUSE', label: '주택/빌라', icon: '/icons/house-white.svg' },
  { type: 'OFFICETEL', label: '오피스텔', icon: '/icons/officetel-white.svg' },
]

/**
 * 건물 타입 선택 바텀 시트 (아이콘 컬러 전환 버전)
 * - 선택 전: 컬러 아이콘
 * - 선택 후: 화이트 아이콘
 */
export default function BuildingTypeBottomSheet({
                                                  isOpen,
                                                  onClose,
                                                  selectedType,
                                                  onSelectType,
                                                }: BuildingTypeBottomSheetProps) {
  const handleSelect = (type: BuildingType | 'all') => {
    onSelectType(type)
    onClose()
  }

  // 선택 상태에 따라 아이콘 세트 결정
  const getIcon = (type: BuildingType | 'all', isSelected: boolean) => {
    const icons = isSelected ? buildingTypesWhiteIcons : buildingTypesIcons
    return icons.find((item) => item.type === type)?.icon
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} fixedHeight={210} expandable={false}>
      <div className="px-4 pb-4 pt-2">
        <h3 className="mb-3 text-sm font-semibold text-gray-900 px-2">건물 유형</h3>

        <div className="flex flex-wrap gap-2">
          {buildingTypesIcons.map((buildingType) => {
            const isSelected = selectedType === buildingType.type
            const iconSrc = getIcon(buildingType.type, isSelected)

            return (
              <button
                key={buildingType.type}
                onClick={() => handleSelect(buildingType.type)}
                className={`flex items-center gap-1 rounded-full border-2 px-3 py-1 text-xs font-medium transition-all duration-150 ${
                  isSelected
                    ? 'border-blue-500 bg-blue-500 text-white'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {iconSrc && (
                  <Image
                    src={iconSrc}
                    width={16}
                    height={16}
                    alt={buildingType.label}
                    className="transition-opacity duration-150"
                  />
                )}
                <span>{buildingType.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </BottomSheet>
  )
}