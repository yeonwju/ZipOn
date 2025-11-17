'use client'

import AucListingCard from '@/components/features/listings/AucListingCard'
import { useAuctionListings } from '@/queries/useListing'

export default function AuctionlistClient() {
  const { data, isLoading } = useAuctionListings()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    )
  }

  const items = Array.isArray(data?.items) ? data.items : []

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">경매 매물이 없습니다.</div>
      </div>
    )
  }

  return (
    <div>
      {items.map(item => (
        <AucListingCard key={item.propertySeq} listing={item} />
      ))}
    </div>
  )
}
