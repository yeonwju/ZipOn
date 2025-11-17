'use client'

import { AuctionDetail } from '@/components/features/auction'
import { generateListingDetail } from '@/data/ListingDetailDummy'

export default function AuctionDetailContent() {
  // TODO: React Query useSuspenseQuery로 교체
  const auctionDummyData = generateListingDetail(1)
  const auctionEndTime = new Date('2025-11-20T24:00:00')

  const handleBid = (_amount: number) => {
    // 결제 페이지로 이동 로직은 AuctionBidSection에서 처리됨
    // TODO: 실제 입찰 API 호출
  }

  return (
    <AuctionDetail
      data={auctionDummyData}
      auctionEndTime={auctionEndTime}
      minimumBid={50000}
      deposit={20000000}
      lessorName="변가원"
      lessorImage="/profile.svg"
      onBid={handleBid}
    />
  )
}

