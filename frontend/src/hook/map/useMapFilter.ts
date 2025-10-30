import { useMemo, useState } from 'react'

import type { AuctionType, BuildingType, ListingData } from '@/types/listing'

/**
 * 지도 매물 필터링 훅
 *
 * 필터 상태와 필터링된 매물 목록을 관리합니다.
 *
 * @param listings - 전체 매물 목록
 * @returns 필터 상태와 필터링된 매물 목록
 *
 * @example
 * ```tsx
 * const { auctionFilter, setAuctionFilter, buildingType, setBuildingType, filteredListings, isAuctionFilter } = useMapFilter(listings)
 * ```
 */
export function useMapFilter(listings: ListingData[]) {
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

    return result
  }, [listings, auctionFilter, buildingType])

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
