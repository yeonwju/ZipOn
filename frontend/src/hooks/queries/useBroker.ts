import { mutationOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { brokerQueryKeys } from '@/constants'
import { getBrokerList, RequestBroker, selectBroker } from '@/services/brokerService'

export function useRequestBrokerList(propertySeq: number) {
  return useQuery({
    queryKey: brokerQueryKeys.lists(propertySeq),
    queryFn: () => getBrokerList(propertySeq),
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
    mutationFn: (request: { strmDate: string; strmStartTm: string; strmEndTm: string; intro: string }) =>
      RequestBroker(propertySeq, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brokerQueryKeys.lists(propertySeq) })
    },
    onError: error => {
      console.error('중개 신청 실패', error)
    },
  })
}
