'use client'

import { useRouter } from 'next/navigation'

import { useAlertDialog } from '@/components/ui/alert-dialog'
import { useAuctionStatusStore } from '@/store/auctionStatus'
import { ListingDetailDataResponse } from '@/types/api/listings'

import CompleteAccountInfo from './CompleteAccountInfo'
import CompleteHeader from './CompleteHeader'
import CompletePaymentInfo from './CompletePaymentInfo'

interface CompleteDetailProps {
  data: ListingDetailDataResponse
  bidAmount: number
  accountNumber: string
  accountHolder: string
}

export default function CompleteDetail({
  data,
  bidAmount,
  accountNumber,
  accountHolder,
}: CompleteDetailProps) {
  const totalAmount = bidAmount
  const { showSuccess, AlertDialog } = useAlertDialog()
  const router = useRouter()
  const setBidStatus = useAuctionStatusStore(state => state.setBidStatus)

  return (
    <div className="flex flex-col bg-gray-50 px-5 pt-2 pb-4">
      <div className="rounded-3xl border border-gray-300 bg-white px-5 py-6 shadow-sm">
        {/* 헤더: 완료 메시지 */}
        <CompleteHeader address={data.address} propertyName={data.propertyNm} />

        {/* 결제 내역 & 계좌 정보 */}
        <section className="mt-6 flex flex-col gap-4">
          <CompletePaymentInfo
            deposit={data.deposit}
            monthlyRent={data.mnRent}
            bidAmount={bidAmount}
          />
          <CompleteAccountInfo
            accountNumber={accountNumber}
            accountHolder={accountHolder}
            totalAmount={totalAmount}
          />
        </section>

        {/* 확인 버튼 */}
        <button
          onClick={() => {
            setTimeout(() => {
              // 상태를 AI_CONTRACT로 변경
              if (data.auctionSeq) {
                setBidStatus(data.auctionSeq, 'AI_CONTRACT')
              }
              showSuccess('송금이 완료되었습니다.', () => router.push('/mypage'))
            }, 700)
          }}
          className="mt-6 w-full rounded-full bg-blue-500 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-600 active:bg-blue-700"
        >
          확인
        </button>
      </div>
      <AlertDialog />
    </div>
  )
}
