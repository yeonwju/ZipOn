import { useMemo, useState } from 'react'

import type { FilterType, ListingData } from '@/types/listing'

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
 * const { filter, setFilter, filteredListings, isAuctionFilter } = useMapFilter(listings)
 * ```
 */
export function useMapFilter(listings: ListingData[]) {
  const [filter, setFilter] = useState<FilterType>('all')

  // 필터링된 매물 목록
  const filteredListings = useMemo(() => {
    if (filter === 'all') {
      return listings
    }
    if (filter === 'auction') {
      return listings.filter(listing => listing.isAuction === true)
    }
    // filter === 'normal'
    return listings.filter(listing => listing.isAuction === false)
  }, [listings, filter])

  // 필터 타입에 따른 boolean 값 (클러스터 색상용)
  const isAuctionFilter = useMemo(() => {
    if (filter === 'auction') return true
    if (filter === 'normal') return false
    return undefined
  }, [filter])

  return {
    filter,
    setFilter,
    filteredListings,
    isAuctionFilter,
  }
}
