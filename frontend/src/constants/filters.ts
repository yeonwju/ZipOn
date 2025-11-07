/**
 * 필터 관련 상수
 */

import type { DirectionFilter, FloorFilter, RoomCountFilter } from '@/types/filter'
import type { AuctionType, BuildingType } from '@/types/models/listing'

// 방 개수 옵션
export const ROOM_COUNT_OPTIONS: { value: RoomCountFilter; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 1, label: '1개' },
  { value: 2, label: '2개' },
  { value: 3, label: '3개' },
  { value: '3+', label: '3개 이상' },
]

// 층수 옵션
export const FLOOR_OPTIONS: { value: FloorFilter; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'B1', label: '지하' },
  { value: 1, label: '1층' },
  { value: 2, label: '2층' },
  { value: '2+', label: '2층 이상' },
]

// 해방향 옵션
export const DIRECTION_OPTIONS: { value: DirectionFilter; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'east', label: '동향' },
  { value: 'west', label: '서향' },
  { value: 'south', label: '남향' },
  { value: 'north', label: '북향' },
]

// 건물 타입 정보
export const BUILDING_TYPE_INFO: Record<BuildingType, { label: string; icon: string }> = {
  room: {
    label: '원투룸',
    icon: '/icons/room.svg',
  },
  apartment: {
    label: '아파트',
    icon: '/icons/apartment.svg',
  },
  house: {
    label: '주택/빌라',
    icon: '/icons/house.svg',
  },
  officetel: {
    label: '오피스텔',
    icon: '/icons/officetel.svg',
  },
}

// 경매 타입
export const AUCTION_TYPE_OPTIONS: {
  type: AuctionType
  label: string
  color: string
}[] = [
  { type: 'all', label: '전체', color: 'bg-purple-500' },
  { type: 'auction', label: '경매', color: 'bg-red-500' },
  { type: 'normal', label: '일반', color: 'bg-blue-500' },
]

// 가격 범위 (만원)
export const PRICE_LIMITS = {
  DEPOSIT_MAX: 100000, // 보증금 10억
  RENT_MAX: 10000, // 월세 1000만원
  MAINTENANCE_MAX: 1000, // 관리비 100만원
} as const

// 면적 범위 (평)
export const AREA_LIMITS = {
  MIN: 1,
  MAX: 100,
} as const
