import { Suspense } from 'react'

import AuctionDetailContent from '@/components/features/auction/bid/AuctionDetailContent'
import { AuctionDetailSkeleton } from '@/components/skeleton/auction'

export const dynamic = 'force-dynamic'

export default function AuctionDetailPage() {
  return (
    <Suspense fallback={<AuctionDetailSkeleton />}>
      <AuctionDetailContent />
    </Suspense>
  )
}
