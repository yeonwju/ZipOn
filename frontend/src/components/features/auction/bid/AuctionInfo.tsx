interface AuctionInfoProps {
  deposit: number
  fee: number
}

export default function AuctionInfo({ deposit, fee }: AuctionInfoProps) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
      <h3 className="mb-3 text-base font-semibold text-gray-900">상세정보</h3>
      <div className="flex flex-col divide-y divide-gray-200">
        <div className="flex justify-between py-2 text-sm">
          <span className="text-gray-500">보증금</span>
          <span className="font-medium text-gray-900">{deposit.toLocaleString()}원</span>
        </div>
        <div className="flex justify-between py-2 text-sm">
          <span className="text-gray-500">월세</span>
          <span className="font-medium text-gray-900">{fee}</span>
        </div>
      </div>
    </div>
  )
}
