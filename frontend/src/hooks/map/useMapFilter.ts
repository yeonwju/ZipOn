import { useMemo, useState } from 'react'

import type { AreaFilter, DirectionFilter, FloorFilter, PriceFilter, RoomCountFilter } from '@/types/filter'
import type { AuctionType, BuildingType, ListingData } from '@/types/models/listing'

interface UseMapFilterParams {
  listings: ListingData[]
  buildingType?: BuildingType | 'all'
  priceFilter?: PriceFilter
  roomCountFilter?: RoomCountFilter
  areaFilter?: AreaFilter
  floorFilter?: FloorFilter
  directionFilter?: DirectionFilter
}

/**
 * 지도 매물 필터링 훅
 *
 * 필터 상태와 필터링된 매물 목록을 관리합니다.
 *
 * @param params - 전체 매물 목록 및 필터 옵션
 * @returns 필터 상태와 필터링된 매물 목록
 *
 * @example
 * ```tsx
 * const { auctionFilter, setAuctionFilter, buildingType, setBuildingType, filteredListings, isAuctionFilter } = useMapFilter({
 *   listings,
 *   priceFilter,
 *   roomCountFilter,
 *   areaFilter,
 *   floorFilter,
 *   directionFilter
 * })
 * ```
 */
export function useMapFilter({
  listings,
  buildingType = 'all',
  priceFilter,
  roomCountFilter,
  areaFilter,
  floorFilter,
  directionFilter,
}: UseMapFilterParams) {
  const [auctionFilter, setAuctionFilter] = useState<AuctionType>('all')

  // 필터링된 매물 목록
  const filteredListings = useMemo(() => {
    let result = listings

    // 경매 필터 적용
    if (auctionFilter === 'auction') {
      result = result.filter(listing => listing.isAucPref)
    } else if (auctionFilter === 'normal') {
      result = result.filter(listing => !listing.isAucPref)
    }

    // 건물 타입 필터 적용 (all이 아닐 때만)
    if (buildingType !== 'all') {
      result = result.filter(listing => listing.buildingType === buildingType)
    }

    // 금액 필터 적용
    if (priceFilter) {
      result = result.filter(listing => {
        // 보증금 필터
        if (listing.deposit < priceFilter.deposit.min) return false
        if (priceFilter.deposit.max !== null && listing.deposit > priceFilter.deposit.max)
          return false

        // 월세 필터
        if (listing.mnRent < priceFilter.rent.min) return false
        if (priceFilter.rent.max !== null && listing.mnRent > priceFilter.rent.max) return false

        // 관리비 필터
        if (listing.fee < priceFilter.maintenance.min) return false
        if (priceFilter.maintenance.max !== null && listing.fee > priceFilter.maintenance.max)
          return false

        return true
      })
    }

    // 방수 필터 적용 ('all'일 때는 필터 적용 안 함)
    if (roomCountFilter && roomCountFilter !== 'all') {
      result = result.filter(listing => {
        const roomCount = Number(listing.roomCnt) || 0
        if (roomCountFilter === '3+') {
          return roomCount >= 3
        }
        return roomCount === roomCountFilter
      })
    }

    // 면적 필터 적용
    if (areaFilter) {
      // 면적이 무제한인 경우 (max가 MAX_AREA + 1 이상이면 무제한)
      const maxArea = areaFilter.max >= 100 ? Infinity : areaFilter.max
      result = result.filter(listing => {
        const listingPyeong = listing.areaP
        return listingPyeong >= areaFilter.min && listingPyeong <= maxArea
      })
    }

    // 층수 필터 적용 ('all'일 때는 필터 적용 안 함)
    if (floorFilter && floorFilter !== 'all') {
      result = result.filter(listing => {
        const floor = Number(listing.floor) || 0
        if (floorFilter === 'B1') {
          return floor < 0
        } else if (floorFilter === '2+') {
          return floor >= 2
        } else {
          return floor === floorFilter
        }
      })
    }

    // 해방향 필터 적용 ('all'일 때는 필터 적용 안 함)
    if (directionFilter && directionFilter !== 'all') {
      // directionFilter: 'east', 'west', 'south', 'north'
      // facing: 'N', 'S', 'E', 'W'
      const directionMap: Record<string, string> = {
        east: 'E',
        west: 'W',
        south: 'S',
        north: 'N',
      }
      const facingValue = directionMap[directionFilter]
      result = result.filter(listing => listing.facing === facingValue)
    }

    return result
  }, [
    listings,
    auctionFilter,
    buildingType,
    priceFilter,
    roomCountFilter,
    areaFilter,
    floorFilter,
    directionFilter,
  ])

  // 필터 타입에 따른 boolean 값 (클러스터 색상용)
  const isAuctionFilter = useMemo(() => {
    if (auctionFilter === 'auction') return true
    if (auctionFilter === 'normal') return false
    return undefined
  }, [auctionFilter])

  return {
    auctionFilter,
    setAuctionFilter,
    filteredListings,
    isAuctionFilter,
  }
}
