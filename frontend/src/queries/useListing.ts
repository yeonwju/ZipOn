import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { listingQueryKeys } from '@/constants'
import {
  createListing,
  deleteListing,
  getAuctionListings,
  getBrkListings,
  getGeneralListings,
  getListingDetail,
  registerListingVerification,
} from '@/services/listingService'
import { ListingAuctions, RegListingRequest } from '@/types/api/listings'

/**
 * 등기부등본 인증 Mutation Hook
 */
export function useRegisterListingVerification() {
  return useMutation({
    mutationFn: (request: {
      file: File
      regiNm: string | null | undefined
      regiBirth: string | null | undefined
      address: string
    }) => registerListingVerification(request),
    onError: error => {
      console.error('등기부등본 인증 실패:', error)
    },
  })
}

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

/**
 * 매물 삭제 Mutation Hook
 */
export function useDeleteListing() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (propertySeq: number) => deleteListing(propertySeq),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listingQueryKeys.all })
    },
    onError: error => {
      console.error('매물 삭제 실패:', error)
    },
  })
}

/**
 * 매물 상세 정보 조회 Hook
 */
export function useSearchListingDetail(
  seq: number,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: listingQueryKeys.detail(seq),
    queryFn: async () => {
      const result = await getListingDetail(seq)
      if (!result.data) {
        throw new Error('매물 정보를 찾을 수 없습니다.')
      }
      return result.data
    },
    enabled: options?.enabled !== false && !!seq,
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
      if (!result.data) {
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
      if (!result.data) {
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
      if (!result.data) {
        throw new Error('중개 매물 목록 조회 실패')
      }
      return result.data
    },
  })
}
