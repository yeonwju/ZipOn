import { useMutation, useQueryClient } from '@tanstack/react-query'

import { listingQueryKeys } from '@/constants'
import { createListing } from '@/services/listingService'
import { RegListingRequest } from '@/types/api/listings'

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
