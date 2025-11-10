import { Suspense } from 'react'

import AuctionDetailContent from '@/components/features/auction/bid/AuctionDetailContent'
import { AuctionDetailSkeleton } from '@/components/skeleton/auction'

export default function AuctionDetailPage() {
  return (
    <Suspense fallback={<AuctionDetailSkeleton />}>
      <AuctionDetailContent />
    </Suspense>
  )
}
