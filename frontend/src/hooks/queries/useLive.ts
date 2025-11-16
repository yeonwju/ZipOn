'use client'

import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

import { liveQueryKeys } from '@/constants'
import {
  endLive,
  getCanLiveAuctionList,
  getLiveEnterToken,
  getLiveList,
  leaveLive,
  likeLive,
  liveChatList,
  searchLiveInfo,
  startLive,
} from '@/services/liveService'
import { LiveEnterTokenData, LiveInfoData } from '@/types/api/live'

/**
 * 라이브 가능한 경매 목록 조회 Query
 *
 * @description
 * - liveQueryKeys.auctions() 사용: 라이브 방송을 시작할 수 있는 경매 목록
 * - 라이브 방송 시작 시 이 목록에서 제외되므로 캐시 무효화 필요
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
 * 상태별 라이브 목록 조회 Query
 *
 * @param status - 라이브 상태 (예: 'ONAIR', 'ENDED' 등)
 * @param sortType - 정렬 타입
 *
 * @description
 * - liveQueryKeys.live({ status, sortType }) 사용: 필터링된 라이브 목록
 * - status와 sortType을 filters로 전달하여 각각 다른 캐시 키 생성
 * - 예: ['live', 'list', { status: 'ONAIR', sortType: 'LATEST' }]
 * - useSuspenseQuery를 사용하여 Suspense 경계에서 스켈레톤 UI 표시
 */
export function useGetLiveList({ status, sortType }: { status: string; sortType: string }) {
  return useSuspenseQuery({
    queryKey: liveQueryKeys.live({ status, sortType }),
    queryFn: async () => {
      const result = await getLiveList({ status, sortType })
      if (!result.success) {
        throw new Error('라이브 목록 조회 실패')
      }
      return result.data ?? []
    },
  })
}

/**
 * 라이브 방송 정보 조회 Query
 *
 * @param liveSeq - 라이브 시퀀스 번호
 *
 * @description
 * - liveQueryKeys.detail(liveSeq) 사용: 특정 라이브의 상세 정보
 * - 라이브 방송 페이지에서 사용
 * - enabled로 liveSeq가 있을 때만 실행
 */
export function useGetLiveInfo(liveSeq: number) {
  return useQuery({
    queryKey: liveQueryKeys.detail(liveSeq),
    queryFn: async () => {
      const result = await searchLiveInfo(liveSeq)
      if (!result.success) {
        throw new Error('라이브 방송 정보 조회 실패')
      }
      return result.data
    },
    enabled: !!liveSeq,
  })
}

/**
 * 라이브 채팅 내역 조회 Query
 *
 * @param liveSeq - 라이브 시퀀스 번호
 *
 * @description
 * - liveQueryKeys.detail(liveSeq)와 같은 라이브를 참조하지만, 채팅은 별도 데이터
 * - 현재 queryKeys에 채팅 전용 키가 없으므로 detail 키를 재사용하거나
 * - 향후 liveQueryKeys.chat(liveSeq) 같은 키 추가 고려
 * - 일단 liveSeq를 기반으로 캐시 관리
 */
export function useGetLiveChatHistory(liveSeq: number) {
  return useQuery({
    queryKey: [...liveQueryKeys.detail(liveSeq), 'chat'], // detail 키에 'chat' 추가
    queryFn: async () => {
      const result = await liveChatList(liveSeq)
      if (!result.success) {
        throw new Error('라이브 채팅 내역 조회 실패')
      }
      return result.data
    },
    enabled: !!liveSeq, // liveSeq가 있을 때만 쿼리 실행
  })
}

/**
 * 라이브 방송 시작 Mutation
 *
 * @description
 * - 라이브 방송을 시작하면:
 *   1. 라이브 목록 캐시 무효화 (새 라이브가 목록에 추가됨)
 *   2. 라이브 가능한 경매 목록 캐시 무효화 (시작한 경매는 목록에서 제외)
 *   3. 생성된 라이브 상세 정보를 캐시에 저장 (즉시 사용 가능)
 *   4. 라이브 방송 페이지로 이동
 */
export function useStartLive() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (params: { auctionSeq: number; title: string }) => startLive(params),

    onSuccess: data => {
      if (data.success && data.data) {
        // 라이브 목록 캐시 무효화 (새 라이브가 추가됨)
        queryClient.invalidateQueries({
          queryKey: liveQueryKeys.lives(),
        })

        // 라이브 가능한 경매 목록 캐시 무효화 (방송 시작한 경매는 목록에서 제외됨)
        queryClient.invalidateQueries({
          queryKey: liveQueryKeys.auctions(),
        })

        // 생성된 라이브 상세 정보 캐시에 저장 (즉시 사용 가능)
        queryClient.setQueryData(liveQueryKeys.detail(data.data.liveSeq), data.data)

        // 라이브 방송 페이지로 이동
        router.push(`/live/onair/${data.data.liveSeq}`)
      }
    },
  })
}

/**
 * 라이브 방 입장 토큰 발급 Mutation
 *
 * @description
 * - 라이브 방 입장 시 토큰을 발급받음
 * - 토큰 발급 후 해당 라이브의 상세 정보 캐시 업데이트 (토큰 정보 포함)
 * - liveSeq를 기반으로 캐시 관리
 */
export function useGetLiveEnterToken() {
  return useMutation({
    mutationFn: (params: { liveSeq: number; isHost: boolean }) => getLiveEnterToken(params),
  })
}

/**
 * 라이브 좋아요 Mutation
 *
 * @description
 * - 좋아요 토글 시 해당 라이브의 상세 정보 캐시 업데이트
 * - 좋아요 수가 변경되므로 상세 정보를 무효화하여 재조회
 */
export function useLikeLive() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (liveSeq: number) => likeLive(liveSeq),

    onSuccess: (data, liveSeq) => {
      if (data.success) {
        // 해당 라이브의 상세 정보 캐시 무효화 (좋아요 수 업데이트)
        queryClient.invalidateQueries({
          queryKey: liveQueryKeys.detail(liveSeq),
        })
      }
    },
  })
}

/**
 * 라이브 방송 퇴장 Mutation
 *
 * @description
 * - 라이브 방에서 퇴장할 때 호출
 * - 퇴장 후에는 상세 정보가 변경될 수 있으므로 캐시 무효화
 */
export function useLeaveLive() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (liveSeq: number) => leaveLive(liveSeq),

    onSuccess: (data, liveSeq) => {
      if (data.success) {
        // 해당 라이브의 상세 정보 캐시 무효화 (시청자 수 등 변경 가능)
        queryClient.invalidateQueries({
          queryKey: liveQueryKeys.detail(liveSeq),
        })
      }
    },
  })
}

/**
 * 라이브 방송 종료 Mutation
 *
 * @description
 * - 라이브 방송을 종료할 때 호출
 * - 종료 후:
 *   1. 해당 라이브의 상세 정보 캐시 무효화 (상태가 ENDED로 변경)
 *   2. 라이브 목록 캐시 무효화 (상태 변경으로 목록에 영향)
 *   3. 라이브 가능한 경매 목록 캐시 무효화 (종료된 경매는 다시 목록에 나타날 수 있음)
 */
export function useEndLive() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (liveSeq: number) => endLive(liveSeq),

    onSuccess: (data, liveSeq) => {
      if (data.success && data.data) {
        // 해당 라이브의 상세 정보 캐시 무효화 (상태가 ENDED로 변경)
        queryClient.invalidateQueries({
          queryKey: liveQueryKeys.detail(liveSeq),
        })

        // 라이브 목록 캐시 무효화 (상태 변경으로 목록에 영향)
        queryClient.invalidateQueries({
          queryKey: liveQueryKeys.lives(),
        })

        // 라이브 가능한 경매 목록 캐시 무효화 (종료된 경매는 다시 목록에 나타날 수 있음)
        queryClient.invalidateQueries({
          queryKey: liveQueryKeys.auctions(),
        })

        // 종료된 라이브 상세 정보를 캐시에 저장
        queryClient.setQueryData(liveQueryKeys.detail(liveSeq), data.data)

        // 라이브 목록 페이지로 이동 (또는 다른 페이지)
        router.push('/live/list')
      }
    },
  })
}
