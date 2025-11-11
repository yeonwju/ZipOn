/**
 * 필터 중개 레이어 (Filter Adapter)
 *
 * 이 파일은 API 응답 타입과 내부 필터 타입 간의 변환을 담당합니다.
 * API 구조가 변경되거나 새로운 필터가 추가될 때, 이 파일만 수정하면 됩니다.
 */

import type {
  ApiAreaFilter,
  ApiDirectionFilter,
  ApiFilterRequest,
  ApiFilterResponse,
  ApiFloorFilter,
  ApiPriceFilter,
  ApiRoomCountFilter,
} from '@/types/api/filter'
import type {
  AreaFilter,
  DirectionFilter,
  FloorFilter,
  PriceFilter,
  RoomCountFilter,
} from '@/types/filter'

/**
 * API 금액 필터를 내부 타입으로 변환
 */
export function mapApiPriceToInternal(apiPrice?: ApiPriceFilter): PriceFilter {
  if (!apiPrice) {
    return {
      deposit: { min: 0, max: null },
      rent: { min: 0, max: null },
      maintenance: { min: 0, max: null },
    }
  }

  return {
    deposit: {
      min: apiPrice.deposit_min ?? 0,
      max: apiPrice.deposit_max ?? null,
    },
    rent: {
      min: apiPrice.rent_min ?? 0,
      max: apiPrice.rent_max ?? null,
    },
    maintenance: {
      min: apiPrice.maintenance_min ?? 0,
      max: apiPrice.maintenance_max ?? null,
    },
  }
}

/**
 * 내부 금액 필터를 API 타입으로 변환
 */
export function mapInternalPriceToApi(price: PriceFilter): ApiPriceFilter {
  return {
    deposit_min: price.deposit.min,
    deposit_max: price.deposit.max,
    rent_min: price.rent.min,
    rent_max: price.rent.max,
    maintenance_min: price.maintenance.min,
    maintenance_max: price.maintenance.max,
  }
}

/**
 * API 방 개수 필터를 내부 타입으로 변환
 */
export function mapApiRoomCountToInternal(apiRoomCount?: ApiRoomCountFilter): RoomCountFilter {
  if (apiRoomCount === undefined || apiRoomCount === null) {
    return 1
  }

  // API에서 'more_than_3' 같은 형식으로 올 수 있음
  if (apiRoomCount === 'more_than_3' || apiRoomCount === '3+') {
    return '3+'
  }

  const numValue = typeof apiRoomCount === 'number' ? apiRoomCount : Number(apiRoomCount)
  if (numValue >= 1 && numValue <= 3) {
    return numValue as 1 | 2 | 3
  }

  return 1 // 기본값
}

/**
 * 내부 방 개수 필터를 API 타입으로 변환
 */
export function mapInternalRoomCountToApi(roomCount: RoomCountFilter): ApiRoomCountFilter {
  if (roomCount === '3+') {
    return 'more_than_3' // API 형식에 맞게 변경 가능
  }
  return roomCount
}

/**
 * API 면적 필터를 내부 타입으로 변환
 */
export function mapApiAreaToInternal(apiArea?: ApiAreaFilter): AreaFilter {
  if (!apiArea) {
    return { min: 0, max: 80 }
  }

  return {
    min: apiArea.area_min ?? 0,
    max: apiArea.area_max ?? 80,
  }
}

/**
 * 내부 면적 필터를 API 타입으로 변환
 */
export function mapInternalAreaToApi(area: AreaFilter): ApiAreaFilter {
  return {
    area_min: area.min,
    area_max: area.max,
  }
}

/**
 * API 층수 필터를 내부 타입으로 변환
 */
export function mapApiFloorToInternal(apiFloor?: ApiFloorFilter): FloorFilter {
  if (!apiFloor) {
    return 'B1'
  }

  // API 형식 변환 (예: 'above_2' -> '2+')
  if (apiFloor === 'above_2' || apiFloor === '2+') {
    return '2+'
  }

  if (apiFloor === 'basement' || apiFloor === 'B1') {
    return 'B1'
  }

  // 숫자 값인 경우
  const numValue = typeof apiFloor === 'number' ? apiFloor : Number(apiFloor)
  if (numValue >= 1 && numValue <= 2) {
    return numValue as 1 | 2
  }

  return 'B1' // 기본값
}

/**
 * 내부 층수 필터를 API 타입으로 변환
 */
export function mapInternalFloorToApi(floor: FloorFilter): ApiFloorFilter {
  if (floor === '2+') {
    return 'above_2' // API 형식에 맞게 변경 가능
  }
  if (floor === 'B1') {
    return 'basement' // API 형식에 맞게 변경 가능
  }
  return floor
}

/**
 * API 해방향 필터를 내부 타입으로 변환
 */
export function mapApiDirectionToInternal(apiDirection?: ApiDirectionFilter): DirectionFilter {
  if (!apiDirection) {
    return 'east'
  }

  // 유효한 방향인지 확인
  const validDirections: DirectionFilter[] = ['east', 'west', 'south', 'north']
  if (validDirections.includes(apiDirection as DirectionFilter)) {
    return apiDirection as DirectionFilter
  }

  return 'east' // 기본값
}

/**
 * 내부 해방향 필터를 API 타입으로 변환
 */
export function mapInternalDirectionToApi(direction: DirectionFilter): ApiDirectionFilter {
  return direction
}

/**
 * 전체 API 필터 응답을 내부 필터 상태로 변환
 */
export function mapApiFilterToInternal(apiFilter: ApiFilterResponse) {
  return {
    price: mapApiPriceToInternal(apiFilter.price),
    roomCount: mapApiRoomCountToInternal(apiFilter.room_count),
    area: mapApiAreaToInternal(apiFilter.area),
    floor: mapApiFloorToInternal(apiFilter.floor),
    direction: mapApiDirectionToInternal(apiFilter.direction),
  }
}

/**
 * 내부 필터 상태를 전체 API 필터 요청으로 변환
 */
export function mapInternalFilterToApi(filter: {
  price: PriceFilter
  roomCount: RoomCountFilter
  area: AreaFilter
  floor: FloorFilter
  direction: DirectionFilter
}): ApiFilterRequest {
  return {
    price: mapInternalPriceToApi(filter.price),
    room_count: mapInternalRoomCountToApi(filter.roomCount),
    area: mapInternalAreaToApi(filter.area),
    floor: mapInternalFloorToApi(filter.floor),
    direction: mapInternalDirectionToApi(filter.direction),
  }
}

/**
 * 기본 필터 값 생성 (초기화용)
 */
export function createDefaultFilters() {
  return {
    price: {
      deposit: { min: 0, max: null },
      rent: { min: 0, max: null },
      maintenance: { min: 0, max: null },
    },
    roomCount: 1 as RoomCountFilter,
    area: { min: 0, max: 80 },
    floor: 'B1' as FloorFilter,
    direction: 'east' as DirectionFilter,
  }
}
