'use client'

import React from 'react'

import type { AuctionType } from '@/types/listing'

interface MapFilterProps {
  selectedFilter: AuctionType
  onFilterChange: (filter: AuctionType) => void
}

/**
 * 지도 필터 컴포넌트
 *
 * 전체, 경매, 일반 매물을 필터링하는 버튼 그룹
 */
export default function AuctionTypeFilter({ selectedFilter, onFilterChange }: MapFilterProps) {
  const filters: {
    type: AuctionType
    label: string
    color: string
    hoverColor: string
  }[] = [
    {
      type: 'all',
      label: '전체',
      color: 'bg-purple-500 text-white',
      hoverColor: 'hover:bg-purple-50',
    },
    {
      type: 'auction',
      label: '경매',
      color: 'bg-red-500 text-white',
      hoverColor: 'hover:bg-red-50',
    },
    {
      type: 'normal',
      label: '일반',
      color: 'bg-blue-500 text-white',
      hoverColor: 'hover:bg-blue-50',
    },
  ]

  return (
    <div className="flex flex-col gap-2 rounded-lg bg-white p-1 shadow-lg">
      {filters.map(filter => (
        <button
          key={filter.type}
          onClick={() => onFilterChange(filter.type)}
          className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-all ${
            selectedFilter === filter.type
              ? `${filter.color} text-white shadow-sm`
              : 'bg-white text-gray-700 hover:bg-gray-100'
          } `}
          aria-label={`${filter.label} 매물 보기`}
        >
          <span className="text-xs">{filter.label}</span>
        </button>
      ))}
    </div>
  )
}
