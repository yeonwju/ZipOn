'use client'

import ListingImageGallery from '@/components/features/listings/detail/ListingImageGallery'
import { ListingDetailDataResponse } from '@/types/api/listings'

import BrokerApplicationForm from './BrokerApplicationForm'
import BrokerOwnerInfo from './BrokerOwnerInfo'
import BrokerPropertyInfo from './BrokerPropertyInfo'

interface BrokerApplicationDetailProps {
  listing?: ListingDetailDataResponse
  ownerName: string
  ownerImage?: string
  preferredTime?: string
  ownerDescription?: string
}

export default function BrokerApplicationDetail({
  listing,
  ownerName,
  ownerImage,
  preferredTime,
  ownerDescription,
}: BrokerApplicationDetailProps) {
  if (!listing) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* 이미지 갤러리 */}
      <ListingImageGallery images={listing.images} />

      {/* 상세 내용 */}
      <div className="relative z-10 -mt-2 rounded-t-3xl bg-white px-5 py-6 shadow-sm">
        {/* 헤더: 주소 */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900">{listing.address}</h2>
          <span className="text-sm text-gray-600">{listing.propertyNm}</span>
        </div>

        {/* 매물 정보, 집주인 정보, 신청 폼 */}
        <section className="flex flex-col gap-4">
          <BrokerPropertyInfo listing={listing} />
          <BrokerOwnerInfo
            ownerName={ownerName}
            ownerImage={ownerImage}
            preferredTime={preferredTime}
            ownerDescription={ownerDescription}
          />
          <BrokerApplicationForm />
        </section>
      </div>
    </div>
  )
}
