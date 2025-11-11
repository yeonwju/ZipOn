import { Suspense } from 'react'

import CompleteDetailContent from '@/components/features/auction/complete/CompleteDetailContent'
import { CompleteDetailSkeleton } from '@/components/skeleton/auction'

export default function PaymentCompletePage() {
  return (
    <Suspense fallback={<CompleteDetailSkeleton />}>
      <CompleteDetailContent />
    </Suspense>
  )
}
