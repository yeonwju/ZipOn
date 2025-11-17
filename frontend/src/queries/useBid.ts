'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { bid, bidAccept, bidReject } from '@/services/bidService'

/**
 * 입찰하기 Mutation Hook
 */
export function useBid() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ auctionSeq, amount }: { auctionSeq: number; amount: number }) =>
      bid(auctionSeq, amount),
    onError: error => {
      console.error('입찰 실패:', error)
    },
  })
}

/**
 * 입찰 수락 Mutation Hook
 */
export function useBidAccept() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (auctionSeq: number) => bidAccept(auctionSeq),
    onSuccess: () => {
      // 필요시 관련 쿼리 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['auctions'] })
      queryClient.invalidateQueries({ queryKey: ['mypage'] })
    },
    onError: error => {
      console.error('입찰 수락 실패:', error)
    },
  })
}

/**
 * 입찰 거절 Mutation Hook
 */
export function useBidReject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (auctionSeq: number) => bidReject(auctionSeq),
    onSuccess: () => {
      // 필요시 관련 쿼리 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['auctions'] })
      queryClient.invalidateQueries({ queryKey: ['mypage'] })
    },
    onError: error => {
      console.error('입찰 거절 실패:', error)
    },
  })
}
