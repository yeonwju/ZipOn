import { Suspense } from 'react'

import BrokerApplicationContent from '@/components/features/listings/brokers/request/BrokerApplicationContent'
import { BrokerApplicationSkeleton } from '@/components/skeleton/listings'

export default function ListingsBrokersPage() {
  return (
    <Suspense fallback={<BrokerApplicationSkeleton />}>
      <BrokerApplicationContent />
    </Suspense>
  )
}
