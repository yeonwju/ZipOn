import { useQuery } from '@tanstack/react-query'

import { brokerQueryKeys } from '@/constants'
import { getBrokerList } from '@/services/brokerService'

export function useRequestBrokerList(propertySeq: number) {
  return useQuery({
    queryKey: brokerQueryKeys.lists(propertySeq),
    queryFn: () => getBrokerList(propertySeq),
  })
}
