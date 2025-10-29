'use client'

import { Building2, Gavel, Home } from 'lucide-react'

export type FilterType = 'all' | 'auction' | 'normal'

interface MapFilterProps {
  selectedFilter: FilterType
  onFilterChange: (filter: FilterType) => void
}

/**
 * 지도 필터 컴포넌트
 * 
 * 전체, 경매, 일반 매물을 필터링하는 버튼 그룹
 */
export default function MapFilter({ selectedFilter, onFilterChange }: MapFilterProps) {
  const filters: { type: FilterType; label: string; icon: React.ReactNode }[] = [
    { type: 'all', label: '전체', icon: <Building2 className="h-4 w-4" /> },
    { type: 'auction', label: '경매', icon: <Gavel className="h-4 w-4" /> },
    { type: 'normal', label: '일반', icon: <Home className="h-4 w-4" /> },
  ]

  return (
    <div className="flex gap-2 rounded-lg bg-white p-1 shadow-lg">
      {filters.map(filter => (
        <button
          key={filter.type}
          onClick={() => onFilterChange(filter.type)}
          className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-all ${
            selectedFilter === filter.type
              ? 'bg-blue-500 text-white shadow-sm'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
          aria-label={`${filter.label} 매물 보기`}
        >
          {filter.icon}
          <span>{filter.label}</span>
        </button>
      ))}
    </div>
  )
}

