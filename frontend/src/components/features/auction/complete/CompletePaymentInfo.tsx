interface CompletePaymentInfoProps {
  deposit: number
  monthlyRent: number
  bidAmount: number
}

export default function CompletePaymentInfo({ deposit, bidAmount }: CompletePaymentInfoProps) {
  const totalAmount = bidAmount

  return (
    <div className="rounded-2xl border border-gray-300 bg-gray-50 p-4">
      <h3 className="mb-3 text-base font-semibold text-gray-900">신청 내역</h3>
      <div className="flex flex-col divide-y divide-gray-200">
        <div className="flex justify-between py-2 text-sm">
          <span className="text-gray-500">보증금</span>
          <span className="font-medium text-gray-900">{deposit.toLocaleString()}원</span>
        </div>
        <div className="flex justify-between py-2 text-sm">
          <span className="text-gray-500">낙찰금액</span>
          <span className="font-medium text-gray-900">{bidAmount.toLocaleString()}원</span>
        </div>
        <div className="flex justify-between py-3 text-base">
          <span className="font-semibold text-gray-900">최종 입금금액</span>
          <span className="font-bold text-blue-600">{totalAmount.toLocaleString()}원</span>
        </div>
      </div>
    </div>
  )
}
