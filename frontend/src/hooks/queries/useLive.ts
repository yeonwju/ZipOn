'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

import { liveQueryKeys } from '@/constants'
import { getCanLiveAuctionList, startLive } from '@/services/liveService'

/**
 * 라이브 가능한 경매 목록 조회 Query
 */
export function useGetCanLiveAuctionList() {
  return useQuery({
    queryKey: liveQueryKeys.auctions(),
    queryFn: async () => {
      const result = await getCanLiveAuctionList()
      if (!result.success) {
        throw new Error('라이브 가능한 경매 목록 조회 실패')
      }
      return result.data
    },
  })
}

/**
 * 라이브 방송 시작 Mutation
 */
export function useStartLive() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (params: { auctionSeq: number; title: string }) => startLive(params),

    onSuccess: data => {
      if (data.success && data.data) {
        // 라이브 목록 캐시 무효화
        queryClient.invalidateQueries({
          queryKey: liveQueryKeys.lives(),
        })

        // 라이브 가능한 경매 목록 캐시 무효화 (방송 시작한 경매는 목록에서 제외됨)
        queryClient.invalidateQueries({
          queryKey: liveQueryKeys.auctions(),
        })

        // 생성된 라이브 상세 정보 캐시에 저장
        queryClient.setQueryData(liveQueryKeys.detail(data.data.liveSeq), data.data)

        // 라이브 방송 페이지로 이동
        router.replace(`/live/onair/${data.data.liveSeq}`)
      }
    },
  })
}
