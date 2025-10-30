import { useMemo, useState } from 'react'

import type { AreaFilter, DirectionFilter, FloorFilter, PriceFilter, RoomCountFilter } from '@/types/filter'
import type { AuctionType, BuildingType, ListingData } from '@/types/listing'

interface UseMapFilterParams {
  listings: ListingData[]
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
  priceFilter,
  roomCountFilter,
  areaFilter,
  floorFilter,
  directionFilter,
}: UseMapFilterParams) {
  const [auctionFilter, setAuctionFilter] = useState<AuctionType>('all')
  const [buildingType, setBuildingType] = useState<BuildingType>('room')

  // 필터링된 매물 목록
  const filteredListings = useMemo(() => {
    let result = listings

    // 경매 필터 적용
    if (auctionFilter === 'auction') {
      result = result.filter(listing => listing.isAuction)
    } else if (auctionFilter === 'normal') {
      result = result.filter(listing => !listing.isAuction)
    }

    // 건물 타입 필터 적용
    result = result.filter(listing => listing.buildingType === buildingType)

    // 금액 필터 적용
    if (priceFilter) {
      result = result.filter(listing => {
        // 보증금 필터
        if (listing.deposit < priceFilter.deposit.min) return false
        if (priceFilter.deposit.max !== null && listing.deposit > priceFilter.deposit.max)
          return false

        // 월세 필터
        if (listing.rent < priceFilter.rent.min) return false
        if (priceFilter.rent.max !== null && listing.rent > priceFilter.rent.max) return false

        // 관리비 필터 (BuildingData에 maintenance가 없으면 이 부분은 나중에 추가)
        // if (listing.maintenance && listing.maintenance < priceFilter.maintenance.min) return false
        // if (priceFilter.maintenance.max !== null && listing.maintenance && listing.maintenance > priceFilter.maintenance.max) return false

        return true
      })
    }

    // 방수 필터 적용
    if (roomCountFilter) {
      result = result.filter(listing => {
        if (roomCountFilter === '3+') {
          return listing.roomCount >= 3
        }
        return listing.roomCount === roomCountFilter
      })
    }

    // 면적 필터 적용
    if (areaFilter) {
      result = result.filter(listing => {
        return listing.area.pyeong >= areaFilter.min && listing.area.pyeong <= areaFilter.max
      })
    }

    // 층수 필터 적용
    if (floorFilter) {
      result = result.filter(listing => {
        if (floorFilter === 'B1') {
          return listing.floor < 0
        } else if (floorFilter === '2+') {
          return listing.floor >= 2
        } else {
          return listing.floor === floorFilter
        }
      })
    }

    // 해방향 필터 적용
    if (directionFilter) {
      result = result.filter(listing => listing.direction === directionFilter)
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
    buildingType,
    setBuildingType,
    filteredListings,
    isAuctionFilter,
  }
}
