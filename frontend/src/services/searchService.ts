/**
 * 검색 서비스
 *
 * 매물 검색 API 호출을 담당합니다.
 */

import { API_ENDPOINTS } from '@/constants'
import { authFetch } from '@/lib/fetch'
import { ListingAuctions } from '@/types/api/listings'
import { ResponseS } from '@/types/api/live'
import type {
  AreaFilter,
  DirectionFilter,
  FloorFilter,
  PriceFilter,
  RoomCountFilter,
} from '@/types/filter'
import type { BuildingType } from '@/types/models/listing'

/**
 * 검색 요청 파라미터 타입
 */
export interface SearchParams {
  // 키워드 검색
  q?: string
  // 지역 필터
  si?: string
  gu?: string
  dong?: string
  // 가격 필터
  depositMin?: number
  depositMax?: number
  mnRentMin?: number
  mnRentMax?: number
  feeMin?: number
  feeMax?: number
  // 면적 필터
  areaMin?: number
  areaMax?: number
  // 방 개수 필터
  roomCountMin?: number
  roomCountMax?: number
  // 층수 필터
  floorMin?: number
  floorMax?: number
  // 해방향 필터
  facings?: string[]
  // 건물 타입 필터
  building_type?: string[]
  // 경매 관련 필터
  isAuc?: boolean
  isBrk?: boolean
  hasBrk?: boolean
  // 페이지네이션
  page?: number
  size?: number
  // 정렬
  sortField?: string
  sortOrder?: 'asc' | 'desc'
}

/**
 * 필터 상태를 검색 파라미터로 변환
 */
export function convertFiltersToSearchParams(filters: {
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
}): SearchParams {
  console.log('=== 필터를 검색 파라미터로 변환 ===')
  console.log('입력 필터:', filters)

  const params: SearchParams = {
    page: 0,
    size: 1000,
    sortField: 'deposit',
    sortOrder: 'desc',
  }

  // 키워드
  if (filters.keyword) {
    params.q = filters.keyword
  }

  // 가격 필터
  if (filters.price) {
    if (filters.price.deposit.min > 0) {
      params.depositMin = filters.price.deposit.min * 10000 // 만원 단위를 원 단위로 변환
    }
    if (filters.price.deposit.max !== null) {
      params.depositMax = filters.price.deposit.max * 10000
    }
    if (filters.price.rent.min > 0) {
      params.mnRentMin = filters.price.rent.min * 10000
    }
    if (filters.price.rent.max !== null) {
      params.mnRentMax = filters.price.rent.max * 10000
    }
    if (filters.price.maintenance.min > 0) {
      params.feeMin = filters.price.maintenance.min * 10000
    }
    if (filters.price.maintenance.max !== null) {
      params.feeMax = filters.price.maintenance.max * 10000
    }
  }

  // 면적 필터 (평을 m²로 변환, 1평 = 3.3m²)
  if (filters.area) {
    params.areaMin = filters.area.min * 3.3
    if (filters.area.max < 100) {
      // 무제한이 아닌 경우
      params.areaMax = filters.area.max * 3.3
    }
  }

  // 방 개수 필터
  if (filters.roomCount && filters.roomCount !== 'all') {
    if (filters.roomCount === '3+') {
      params.roomCountMin = 3
    } else {
      const count = typeof filters.roomCount === 'number' ? filters.roomCount : 1
      params.roomCountMin = count
      params.roomCountMax = count
    }
  }

  // 층수 필터
  if (filters.floor && filters.floor !== 'all') {
    if (filters.floor === 'B1') {
      params.floorMin = -1
      params.floorMax = -1
    } else if (filters.floor === 1) {
      params.floorMin = 1
      params.floorMax = 1
    } else if (filters.floor === 2) {
      params.floorMin = 2
      params.floorMax = 2
    } else if (filters.floor === '2+') {
      params.floorMin = 2
    }
  }

  // 해방향 필터
  if (filters.direction && filters.direction !== 'all') {
    const directionMap: Record<DirectionFilter, string> = {
      all: '',
      east: 'E',
      west: 'W',
      south: 'S',
      north: 'N',
    }
    params.facings = [directionMap[filters.direction]]
  }

  // 건물 타입 필터
  if (filters.buildingType && filters.buildingType !== 'all') {
    params.building_type = [filters.buildingType]
  }

  // 경매 관련 필터
  if (filters.isAuc !== undefined) {
    params.isAuc = filters.isAuc
  }
  if (filters.isBrk !== undefined) {
    params.isBrk = filters.isBrk
  }
  if (filters.hasBrk !== undefined) {
    params.hasBrk = filters.hasBrk
  }

  console.log('변환된 검색 파라미터:', params)
  console.log('==================')

  return params
}

/**
 * 매물 검색
 */
export async function searchListings(params: SearchParams) {
  // 배열 파라미터를 올바르게 처리하기 위해 URLSearchParams 직접 생성
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return

    if (Array.isArray(value)) {
      // 배열인 경우 각 값을 개별 파라미터로 추가
      value.forEach(v => searchParams.append(key, String(v)))
    } else {
      searchParams.append(key, String(value))
    }
  })

  const url = `${API_ENDPOINTS.LISTINGS_SEARCH}?${searchParams.toString()}`

  return authFetch.get<ResponseS<ListingAuctions>>(url)
}
