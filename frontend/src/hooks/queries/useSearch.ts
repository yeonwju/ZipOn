'use client'

import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/constants/queryKeys'
import { convertFiltersToSearchParams, searchListings } from '@/services/searchService'
import type {
  AreaFilter,
  DirectionFilter,
  FloorFilter,
  PriceFilter,
  RoomCountFilter,
} from '@/types/filter'
import type { BuildingType } from '@/types/models/listing'

/**
 * 검색 필터 타입
 */
export interface SearchFilters {
  keyword?: string
  price?: PriceFilter
  area?: AreaFilter
  roomCount?: RoomCountFilter
  floor?: FloorFilter
  direction?: DirectionFilter
  buildingType?: BuildingType | 'all'
  isAuc?: boolean
  isBrk?: boolean
  hasBrk?: boolean
}

/**
 * 매물 검색 Hook
 *
 * @param filters - 검색 필터
 * @param enabled - 쿼리 실행 여부 (기본: true)
 */
export function useSearchListings(filters: SearchFilters, enabled: boolean = true) {
  const searchParams = convertFiltersToSearchParams(filters)

  return useQuery({
    queryKey: queryKeys.search.results(searchParams as Record<string, unknown>),
    queryFn: async () => {
      const result = await searchListings(searchParams)
      if (!result.success || !result.data) {
        throw new Error('매물 검색 실패')
      }
      return result.data
    },
    enabled: enabled && (!!filters.keyword || Object.keys(filters).length > 1), // 키워드가 있거나 필터가 설정된 경우에만 실행
    staleTime: 30 * 1000, // 30초간 캐시 유지
  })
}
