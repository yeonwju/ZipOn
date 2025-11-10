'use client'

import { Suspense } from 'react'

import NewListingContent from '@/components/features/listings/form/NewListingContent'
import { NewListingSkeleton } from '@/components/skeleton/listings'
import useKakaoLoader from '@/hooks/map/useKakaoLoader'

export default function NewListingPage() {
  useKakaoLoader()

  return (
    <Suspense fallback={<NewListingSkeleton />}>
      <NewListingContent />
    </Suspense>
  )
}
