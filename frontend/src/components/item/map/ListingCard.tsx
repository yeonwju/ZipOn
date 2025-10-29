import Image from 'next/image'

import type { ListingData } from '@/hook/map/useListingMarkers'

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
      <div>
        <h4 className="mb-1 font-semibold text-gray-900">{listing.name}</h4>
        <p className="mb-2 text-sm text-gray-600">{listing.address}</p>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-blue-600">
            보증금 {listing.deposit.toLocaleString()}만원
          </span>
          <span className="text-gray-400">|</span>
          <span className="font-medium text-blue-600">
            월세 {listing.rent.toLocaleString()}만원
          </span>
        </div>
      </div>
    </div>
  )
}
