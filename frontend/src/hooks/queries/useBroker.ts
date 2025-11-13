import { mutationOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { brokerQueryKeys } from '@/constants'
import { getBrokerList, selectBroker } from '@/services/brokerService'

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
