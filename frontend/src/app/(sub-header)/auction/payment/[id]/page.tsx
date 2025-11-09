'use client'

import { useRouter } from 'next/navigation'

import { PaymentDetail } from '@/components/features/auction'
import { useAlertDialog } from '@/components/ui/alert-dialog'
import { generateListingDetail } from '@/data/ListingDetailDummy'

export default function AuctionPaymentPage() {
  const router = useRouter()
  const paymentData = generateListingDetail(1)
  const { showSuccess, AlertDialog } = useAlertDialog()

  const bidAmount = 50000

  const handlePayment = () => {
    // TODO: 실제 결제 API 호출
    showSuccess('가상계좌가 발급되었습니다!', () => {
      router.replace('/auction/payment/complete')
    })
  }

  return (
    <>
      <PaymentDetail
        data={paymentData}
        bidAmount={bidAmount}
        deposit={20000000}
        monthlyRent={500000}
        lessorName="변가원"
        lessorImage="/profile.svg"
        onPayment={handlePayment}
      />
      <AlertDialog />
    </>
  )
}
