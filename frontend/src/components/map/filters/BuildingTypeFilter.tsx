'use client'

import Image from 'next/image'
import React from 'react'

import type { BuildingType } from '@/types/listing'

interface BuildingTypeFilterProps {
  selectedFilter: BuildingType
  onClick: () => void
}

const BUILDING_TYPE_INFO: Record<
  BuildingType,
  {
    label: string
    icon: string
  }
> = {
  room: {
    label: '원투룸',
    icon: '/icons/room-white.svg',
  },
  apartment: {
    label: '아파트',
    icon: '/icons/apartment-white.svg',
  },
  house: {
    label: '주택/빌라',
    icon: '/icons/house-white.svg',
  },
  officetel: {
    label: '오피스텔',
    icon: '/icons/officetel-white.svg',
  },
}

/**
 * 건물 타입 필터 버튼
 *
 * 현재 선택된 건물 타입을 표시하고 클릭하면 선택 모달을 엽니다
 */
export default function BuildingTypeFilter({ selectedFilter, onClick }: BuildingTypeFilterProps) {
  const selectedType = BUILDING_TYPE_INFO[selectedFilter]

  return (
    <button
      onClick={onClick}
      className="flex h-full w-[65px] flex-col items-center justify-center rounded-sm bg-blue-500 px-2 py-0.5 shadow-lg transition-all hover:bg-gray-50 active:scale-95"
      aria-label="건물 유형 선택"
    >
      <Image src={selectedType.icon} width={20} height={20} alt={selectedType.label} />
      <span className="text-xs font-medium whitespace-nowrap text-white">{selectedType.label}</span>
    </button>
  )
}
