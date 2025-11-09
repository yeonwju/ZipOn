import { Suspense } from 'react'

import BrokerApplyContent from '@/components/features/listings/brokers/apply/BrokerApplyContent'
import { BrokerApplySkeleton } from '@/components/skeleton/listings'

export default function ApplyPage() {
  return (
    <Suspense fallback={<BrokerApplySkeleton />}>
      <BrokerApplyContent />
    </Suspense>
  )
}
