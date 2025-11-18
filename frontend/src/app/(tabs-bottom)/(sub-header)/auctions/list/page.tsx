import { Suspense } from 'react'

import AuctionlistClient from '@/app/(tabs-bottom)/(sub-header)/auctions/list/AuctionlistClient'
import { AuctionListSkeleton } from '@/components/skeleton/listings'

export const dynamic = 'force-dynamic'

export default function AuctionsListPage() {
  return (
    <Suspense fallback={<AuctionListSkeleton />}>
      <AuctionlistClient />
    </Suspense>
  )
}
