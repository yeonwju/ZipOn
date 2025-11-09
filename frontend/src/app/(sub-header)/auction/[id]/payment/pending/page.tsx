import { Suspense } from 'react'

import PaymentDetailContent from '@/components/features/auction/payment/PaymentDetailContent'
import { PaymentDetailSkeleton } from '@/components/skeleton/auction'

export default function AuctionPaymentPage() {
  return (
    <Suspense fallback={<PaymentDetailSkeleton />}>
      <PaymentDetailContent />
    </Suspense>
  )
}
