'use client'

import ListingDetailProfile from '@/components/features/listings/detail/ListingDetailProfile'
import { ListingDetailDataResponse } from '@/types/api/listings'

import PaymentHeader from './PaymentHeader'
import PaymentInfo from './PaymentInfo'
import PaymentMethod from './PaymentMethod'

interface PaymentDetailProps {
  data: ListingDetailDataResponse
  bidAmount: number
  deposit: number
  monthlyRent: number
  lessorName: string
  lessorImage?: string
  onPayment?: () => void
}

export default function PaymentDetail({
  data,
  bidAmount,
  deposit,
  monthlyRent,
  lessorName,
  lessorImage = '/profile.svg',
  onPayment,
}: PaymentDetailProps) {
  return (
    <div className="flex flex-col bg-gray-50 px-5 pt-2">
      <div className="rounded-3xl border border-gray-300 bg-white px-5 py-6 shadow-sm">
        {/* 헤더: 주소 및 매물명 */}
        <PaymentHeader address={data.address} propertyName={data.propertyNm} />

        {/* 중개인 프로필 */}
        <div className="mt-4">
          <ListingDetailProfile imgSrc={lessorImage} name={lessorName} className="font-medium" />
        </div>

        {/* 결제 정보 & 결제 수단 */}
        <section className="mt-4 flex flex-col gap-4">
          <PaymentInfo deposit={deposit} monthlyRent={monthlyRent} bidAmount={bidAmount} />
          <PaymentMethod onPayment={onPayment} />
        </section>
      </div>
    </div>
  )
}
