import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { listingQueryKeys } from '@/constants'
import {
  createListing,
  getAuctionListings,
  getBrkListings,
  getGeneralListings,
  getListingDetail,
} from '@/services/listingService'
import { ListingAuctions, RegListingRequest } from '@/types/api/listings'

/**
 * 매물 등록 Mutation Hook
 */
export function useCreateListing() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: RegListingRequest) => createListing(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listingQueryKeys.all })
    },
    onError: error => {
      console.error('매물 등록 실패:', error)
    },
  })
}

export function useSearchListingDetail(seq: number) {
  return useQuery({
    queryKey: listingQueryKeys.detail(seq),
    queryFn: () => getListingDetail(seq),
  })
}

/**
 * 경매 매물 목록 조회 Hook
 */
export function useAuctionListings() {
  return useQuery({
    queryKey: listingQueryKeys.auction(),
    queryFn: async () => {
      const result = await getAuctionListings()
      if (!result.success || !result.data) {
        throw new Error('경매 매물 목록 조회 실패')
      }
      return result.data
    },
  })
}

/**
 * 일반 매물 목록 조회 Hook
 */
export function useGeneralListings() {
  return useQuery({
    queryKey: listingQueryKeys.general(),
    queryFn: async () => {
      const result = await getGeneralListings()
      if (!result.success || !result.data) {
        throw new Error('일반 매물 목록 조회 실패')
      }
      return result.data
    },
  })
}

/**
 * 중개 매물 목록 조회 Hook
 */
export function useBrkListings() {
  return useQuery({
    queryKey: listingQueryKeys.broker(),
    queryFn: async () => {
      const result = await getBrkListings()
      if (!result.success || !result.data) {
        throw new Error('중개 매물 목록 조회 실패')
      }
      return result.data
    },
  })
}
