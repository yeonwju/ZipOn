'use client'

import { useRouter } from 'next/navigation'

import type { BuildingType } from '@/types/models/listing'

const buildingTypes = [
  { label: '전체', value: 'all' as const, icon: '🏠' },
  { label: '아파트', value: 'APARTMENT' as const, icon: '🏢' },
  { label: '원/투룸', value: 'ROOM' as const, icon: '🚪' },
  { label: '주택/빌라', value: 'HOUSE' as const, icon: '🏡' },
  { label: '오피스텔', value: 'OFFICETEL' as const, icon: '🏘️' },
]

export default function BuildingTypeQuickFilter() {
  const router = useRouter()

  const handleFilterClick = (type: BuildingType | 'all') => {
    // 지도 페이지로 이동하면서 필터 파라미터 전달
    const params = new URLSearchParams()
    if (type !== 'all') {
      params.set('buildingType', type)
    }
    router.push(`/map?${params.toString()}`)
  }

  return (
    <div className="flex flex-col gap-3 px-4 pb-3">
      <h2 className="text-lg font-bold text-gray-900">매물 유형별 바로보기</h2>

      {/* 첫 번째 줄: 전체, 아파트 */}
      <div className="grid grid-cols-2 gap-3">
        {buildingTypes.slice(0, 2).map(type => (
          <button
            key={type.value}
            onClick={() => handleFilterClick(type.value)}
            className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-blue-500 hover:shadow-md active:scale-95"
          >
            <span className="text-3xl">{type.icon}</span>
            <span className="text-sm font-semibold text-gray-900">{type.label}</span>
          </button>
        ))}
      </div>

      {/* 두 번째 줄: 원/투룸, 주택/빌라, 오피스텔 */}
      <div className="grid grid-cols-3 gap-3">
        {buildingTypes.slice(2).map(type => (
          <button
            key={type.value}
            onClick={() => handleFilterClick(type.value)}
            className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-blue-500 hover:shadow-md active:scale-95"
          >
            <span className="text-2xl">{type.icon}</span>
            <span className="text-xs font-semibold text-gray-900">{type.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
