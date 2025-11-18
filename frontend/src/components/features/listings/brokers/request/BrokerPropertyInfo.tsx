import { ListingDetailDataResponse } from '@/types/api/listings'
import { formatCurrency } from '@/utils/format'

interface BrokerPropertyInfoProps {
  listing: ListingDetailDataResponse
}

export default function BrokerPropertyInfo({ listing }: BrokerPropertyInfoProps) {
  return (
    <div className="rounded-2xl border border-gray-300 bg-gray-50 p-4">
      <h3 className="mb-3 text-base font-semibold text-gray-900">매물 정보</h3>
      <div className="flex flex-col divide-y divide-gray-200">
        <div className="flex justify-between py-2 text-sm">
          <span className="text-gray-500">주소</span>
          <span className="font-medium text-gray-900">{listing.address}</span>
        </div>
        <div className="flex justify-between py-2 text-sm">
          <span className="text-gray-500">상세주소</span>
          <span className="font-medium text-gray-900">{listing.propertyNm}</span>
        </div>
        <div className="flex justify-between py-2 text-sm">
          <span className="text-gray-500">보증금</span>
          <span className="font-medium text-gray-900">{formatCurrency(listing.deposit)}</span>
        </div>
        <div className="flex justify-between py-2 text-sm">
          <span className="text-gray-500">월세</span>
          <span className="font-medium text-gray-900">{formatCurrency(listing.mnRent)}</span>
        </div>
        <div className="flex justify-between py-2 text-sm">
          <span className="text-gray-500">관리비</span>
          <span className="font-medium text-gray-900">{formatCurrency(listing.fee)}</span>
        </div>
        <div className="flex justify-between py-2 text-sm">
          <span className="text-gray-500">면적</span>
          <span className="font-medium text-gray-900">
            {listing.area}m² ({listing.areaP}평)
          </span>
        </div>
      </div>
    </div>
  )
}
