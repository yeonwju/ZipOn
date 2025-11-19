import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { brokerQueryKeys } from '@/constants'
import { getBrokerList, RequestBroker, selectBroker } from '@/services/brokerService'

/**
 * 중개인 신청 목록 조회 Hook
 */
export function useRequestBrokerList(propertySeq: number) {
  return useQuery({
    queryKey: brokerQueryKeys.lists(propertySeq),
    queryFn: async () => {
      const result = await getBrokerList(propertySeq)
      if (!result.data || !result.data.content) {
        throw new Error('신청 브로커 리스트를 찾을 수 없습니다.')
      }
      return result.data.content
    },
  })
}

export function useSelectBroker(auctionSeq: number, propertySeq: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => selectBroker(auctionSeq),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brokerQueryKeys.lists(propertySeq) })
    },
    onError: error => {
      console.error('브로커 선택 실패', error)
    },
  })
}

export function useRequestBroker(propertySeq: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (request: {
      strmDate: string
      strmStartTm: string
      strmEndTm: string
      intro: string
      auctionEndAt: string
    }) => RequestBroker(propertySeq, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brokerQueryKeys.lists(propertySeq) })
    },
    onError: error => {
      console.error('중개 신청 실패', error)
    },
  })
}
