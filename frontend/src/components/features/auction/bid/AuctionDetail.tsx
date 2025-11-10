import ListingDetailProfile from '@/components/features/listings/detail/ListingDetailProfile'
import ListingImageGallery from '@/components/features/listings/detail/ListingImageGallery'
import type { ListingDetailData } from '@/types/models/listing'

import AuctionBidSection from './AuctionBidSection'
import AuctionDetailHeader from './AuctionDetailHeader'
import AuctionInfo from './AuctionInfo'
import AuctionTimer from './AuctionTimer'

interface AuctionDetailProps {
  data: ListingDetailData
  auctionEndTime: Date
  minimumBid: number
  deposit: number
  lessorName: string
  lessorImage?: string
  onBid?: (amount: number) => void
}

export default function AuctionDetail({
  data,
  auctionEndTime,
  minimumBid,
  deposit,
  lessorName,
  lessorImage = '/profile.svg',
  onBid,
}: AuctionDetailProps) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* 이미지 갤러리 */}
      <ListingImageGallery images={data.images} />

      {/* 상세 내용 */}
      <div className="relative z-10 -mt-2 rounded-t-3xl bg-white px-5 py-6 shadow-sm">
        {/* 헤더: 주소 및 매물명 */}
        <AuctionDetailHeader address={data.address} propertyName={data.propertyNm} />
        {/* 프로필 & 타이머 */}
        <div className="mt-4 flex items-center justify-between">
          <ListingDetailProfile imgSrc={lessorImage} name={lessorName} className="font-medium" />
          <AuctionTimer endTime={auctionEndTime} />
        </div>
        {/* 상세정보 + 입찰 */}
        {/* TODO 추후 특약 사항 첨부*/}
        <section className="mt-4 flex flex-col gap-6">
          <AuctionInfo deposit={deposit} fee={data.fee} />
          <AuctionBidSection minimumBid={minimumBid} onBid={onBid} />
        </section>
      </div>
    </div>
  )
}
