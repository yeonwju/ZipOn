'use client'

import AucListingCard from '@/components/features/listings/AucListingCard'
import { useAuctionListings } from '@/queries/useListing'

export default function AuctionlistClient() {
  const { data } = useAuctionListings()

  const items = Array.isArray(data?.items) ? data.items : []

  // API 응답 데이터 로그
  console.log('[AuctionlistClient] API 응답 데이터:', {
    hasData: !!data,
    itemsCount: items.length,
    items: items.map(item => ({
      propertySeq: item.propertySeq,
      title: item.title,
      thumbnail: item.thumbnail,
      thumbnailType: typeof item.thumbnail,
    })),
  })

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
