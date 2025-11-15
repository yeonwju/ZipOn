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

/**
 * 특정 라이브 상세 정보 조회 Query
 *
 * @param id - 라이브 ID (auctionSeq 또는 liveSeq)
 *
 * @note 현재 liveService에 상세 조회 함수가 없으므로,
 *       추가되면 해당 함수를 사용하도록 수정 필요
 */
export function useGetLiveDetail(id: number) {
  return useQuery({
    queryKey: liveQueryKeys.detail(id),
    queryFn: async () => {
      // TODO: liveService에 getLiveDetail 함수 추가 후 사용
      // const result = await getLiveDetail(id)
      // if (!result.success) {
      //   throw new Error('라이브 상세 정보 조회 실패')
      // }
      // return result.data
      throw new Error('라이브 상세 조회 함수가 아직 구현되지 않았습니다.')
    },
    enabled: !!id, // id가 있을 때만 쿼리 실행
  })
}

/**
 * 필터링된 라이브 목록 조회 Query
 *
 * @param filters - 필터 옵션 (향후 확장용)
 */
export function useGetLiveList(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: liveQueryKeys.live(filters),
    queryFn: async () => {
      // TODO: liveService에 필터링된 목록 조회 함수 추가 후 사용
      // const result = await getLiveList(filters)
      // if (!result.success) {
      //   throw new Error('라이브 목록 조회 실패')
      // }
      // return result.data

      // 현재는 라이브 가능한 경매 목록만 반환
      const result = await getCanLiveAuctionList()
      if (!result.success) {
        throw new Error('라이브 목록 조회 실패')
      }
      return result.data
    },
  })
}
