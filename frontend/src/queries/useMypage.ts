'use client'

import { useQuery } from '@tanstack/react-query'

import { mypageQueryKeys } from '@/constants'
import { myAuctionInfo, myBrokerageInfo, myPropertiseInfo } from '@/services/mypageService'

/**
 * 나의 매물 내역 조회 Hook
 */
export function useMyProperties() {
  return useQuery({
    queryKey: mypageQueryKeys.properties(),
    queryFn: async () => {
      const result = await myPropertiseInfo()
      if (!result.data) {
        throw new Error('나의 매물 내역을 찾을 수 없습니다.')
      }
      return result.data
    },
  })
}

/**
 * 나의 중개 내역 조회 Hook
 */
export function useMyBrokerage() {
  return useQuery({
    queryKey: mypageQueryKeys.brokerage(),
    queryFn: async () => {
      const result = await myBrokerageInfo()
      if (!result.data) {
        throw new Error('나의 중개 내역을 찾을 수 없습니다.')
      }
      return result.data
    },
  })
}

/**
 * 나의 경매 참여 내역 조회 Hook
 */
export function useMyAuctions() {
  return useQuery({
    queryKey: mypageQueryKeys.auctions(),
    queryFn: async () => {
      const result = await myAuctionInfo()
      if (!result.data) {
        throw new Error('나의 경매 참여 내역을 찾을 수 없습니다.')
      }
      return result.data
    },
  })
}
