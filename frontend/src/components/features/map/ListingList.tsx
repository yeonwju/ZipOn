import type { ListingData } from '@/types/listing'

import ListingCard from './ListingCard'

interface ListingListProps {
  listings: ListingData[]
  onListingClick?: (listing: ListingData) => void
}

/**
 * 매물 목록 컴포넌트
 *
 * 여러 매물을 리스트 형태로 표시합니다.
 * 바텀 시트에서 클러스터의 매물들을 보여줄 때 사용됩니다.
 *
 * @param listings - 매물 데이터 배열
 * @param onListingClick - 매물 카드 클릭 콜백
 */
export default function ListingList({ listings, onListingClick }: ListingListProps) {
  return (
    <div>
      {listings.length > 0 ? (
        <div className="space-y-2">
          {listings.map((listing, index) => (
            <ListingCard key={index} listing={listing} onClick={onListingClick} />
          ))}
        </div>
      ) : (
        <div className="py-8 text-center text-gray-500">선택된 매물이 없습니다</div>
      )}
    </div>
  )
}
