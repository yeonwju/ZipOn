'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'

import {
  AreaFilter as AreaFilterComponent,
  DirectionFilter as DirectionFilterComponent,
  FloorFilter as FloorFilterComponent,
  PriceFilter as PriceFilterComponent,
  RoomCountFilter as RoomCountFilterComponent,
} from '@/components/features/listings'
import type {
  AreaFilter,
  DirectionFilter,
  FloorFilter,
  PriceFilter,
  RoomCountFilter,
} from '@/types/filter'
import type { BuildingType } from '@/types/models/listing'

const MIN_AREA = 1
const MAX_AREA = 100

function SearchFilterPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // URL에서 필터 상태 복원
  const getInitialFilters = () => {
    try {
      const filtersParam = searchParams.get('filters')
      if (filtersParam) {
        return JSON.parse(decodeURIComponent(filtersParam))
      }
    } catch {
      // 파싱 실패 시 기본값 반환
    }
    return {
      price: {
        deposit: { min: 0, max: null },
        rent: { min: 0, max: null },
        maintenance: { min: 0, max: null },
      },
      area: { min: MIN_AREA, max: MAX_AREA + 1 },
      roomCount: 'all' as RoomCountFilter,
      floor: 'all' as FloorFilter,
      direction: 'all' as DirectionFilter,
      buildingType: 'all' as BuildingType | 'all',
    }
  }

  const [tempFilters, setTempFilters] = useState<{
    price?: PriceFilter
    area?: AreaFilter
    roomCount?: RoomCountFilter
    floor?: FloorFilter
    direction?: DirectionFilter
    buildingType?: BuildingType | 'all'
  }>(getInitialFilters())

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTempFilters(getInitialFilters())
  }, [searchParams])

  const handleApply = () => {
    // 필터를 URL 파라미터로 인코딩하여 검색 페이지로 전달
    const filtersJson = encodeURIComponent(JSON.stringify(tempFilters))
    router.push(`/search?filters=${filtersJson}`)
  }

  const handleReset = () => {
    const resetFilters = {
      price: {
        deposit: { min: 0, max: null },
        rent: { min: 0, max: null },
        maintenance: { min: 0, max: null },
      },
      area: { min: MIN_AREA, max: MAX_AREA + 1 },
      roomCount: 'all' as RoomCountFilter,
      floor: 'all' as FloorFilter,
      direction: 'all' as DirectionFilter,
      buildingType: 'all' as BuildingType | 'all',
    }
    setTempFilters(resetFilters)
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* 필터 내용 */}
      <div className="mt-6 mb-10 flex-1 overflow-y-auto">
        <div className="space-y-3 pb-4">
          {/* 금액 필터 */}
          <div className="border-b-8 border-gray-200">
            <PriceFilterComponent
              selectedPrice={
                tempFilters.price || {
                  deposit: { min: 0, max: null },
                  rent: { min: 0, max: null },
                  maintenance: { min: 0, max: null },
                }
              }
              onPriceChange={price => setTempFilters({ ...tempFilters, price })}
              onApply={() => {}}
              showButtons={false}
            />
          </div>

          {/* 면적 필터 */}
          <AreaFilterComponent
            areaFilter={tempFilters.area || { min: MIN_AREA, max: MAX_AREA + 1 }}
            onAreaChange={area => setTempFilters({ ...tempFilters, area })}
            maxLimit={MAX_AREA}
            minLimit={MIN_AREA}
          />

          {/* 방 개수 필터 */}
          <div className="border-b-8 border-gray-200">
            <RoomCountFilterComponent
              selectedRoomCount={tempFilters.roomCount || 'all'}
              onRoomCountChange={roomCount => setTempFilters({ ...tempFilters, roomCount })}
            />
          </div>

          {/* 층수 필터 */}
          <FloorFilterComponent
            selectedFloor={tempFilters.floor || 'all'}
            onFloorChange={floor => setTempFilters({ ...tempFilters, floor })}
          />

          {/* 해방향 필터 */}
          <DirectionFilterComponent
            selectedDirection={tempFilters.direction || 'all'}
            onDirectionChange={direction => setTempFilters({ ...tempFilters, direction })}
          />

          {/* 건물 타입 필터 */}
          <div className="border-b-8 border-gray-200 px-6 pb-4">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-900">건물 타입</h3>
            </div>

            <div className="flex flex-row flex-wrap gap-2">
              {(['all', 'ROOM', 'APARTMENT', 'HOUSE', 'OFFICETEL'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setTempFilters({ ...tempFilters, buildingType: type })}
                  className={`rounded-full border-2 px-3 py-1 text-xs font-medium transition-all ${
                    (tempFilters.buildingType || 'all') === type
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {type === 'all'
                    ? '전체'
                    : type === 'ROOM'
                      ? '원투룸'
                      : type === 'APARTMENT'
                        ? '아파트'
                        : type === 'HOUSE'
                          ? '주택/빌라'
                          : '오피스텔'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 하단 고정 버튼 */}
      <div className="fixed right-0 bottom-0 left-0 z-10 border-t border-gray-200 bg-white px-4 py-3 shadow-lg">
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="flex-1 rounded-lg border border-gray-300 bg-white py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            초기화
          </button>
          <button
            onClick={handleApply}
            className="flex-1 rounded-lg bg-blue-600 py-3 text-sm font-medium text-white hover:bg-blue-700"
          >
            적용
          </button>
        </div>
      </div>
    </div>
  )
}

export default function SearchFilterPageClient() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-white">로딩 중...</div>
      }
    >
      <SearchFilterPageContent />
    </Suspense>
  )
}
