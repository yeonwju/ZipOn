import Image from 'next/image'

import type { ListingData } from '@/types/models/listing'
import { formatCurrency } from '@/utils/format'

interface ListingCardProps {
  listing: ListingData
  onClick?: (listing: ListingData) => void
}

/**
 * 매물 카드 컴포넌트
 *
 * 매물의 기본 정보를 카드 형태로 표시합니다.
 * 바텀 시트나 리스트에서 사용됩니다.
 *
 * @param listing - 매물 데이터
 * @param onClick - 카드 클릭 콜백
 */
export default function ListingCard({ listing, onClick }: ListingCardProps) {
  return (
    <div
      className="flex cursor-pointer flex-row gap-4 border-b border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
      onClick={() => onClick?.(listing)}
    >
      <Image
        src={'/listing.svg'}
        width={80}
        height={80}
        alt={'매물 사진'}
        style={{ width: 80, height: 80 }}
      />
      <div className="flex-1">
        <div className="mb-1 flex items-center gap-2">
          <h4 className="font-semibold text-gray-900">{listing.propertyNm}</h4>
          {listing.isAucPref ? (
            <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
              경매
            </span>
          ) : (
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
              일반
            </span>
          )}
        </div>
        <p className="mb-2 text-sm text-gray-600">{listing.address}</p>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-blue-600">
            보증금 {formatCurrency(listing.deposit)}
          </span>
          <span className="text-gray-400">|</span>
          <span className="font-medium text-blue-600">월세 {formatCurrency(listing.mnRent)}</span>
        </div>
      </div>
    </div>
  )
}
