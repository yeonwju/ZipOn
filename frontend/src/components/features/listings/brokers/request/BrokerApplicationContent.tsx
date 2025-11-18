'use client'

import { useParams } from 'next/navigation'

import { normalizeImageUrl } from '@/utils/format'
import { BrokerApplicationDetail } from '@/components/features/listings/brokers'
import { useSearchListingDetail } from '@/queries/useListing'

export default function BrokerApplicationContent() {
  const params = useParams()

  // TODO: React Query useSuspenseQuery로 교체
  const { data: listing, isLoading, isError } = useSearchListingDetail(Number(params.id))

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">로딩 중...</div>
  }

  if (isError || !listing) {
    return <div className="flex items-center justify-center p-8 text-red-500">매물 정보를 불러올 수 없습니다.</div>
  }

  return (
    <BrokerApplicationDetail
      listing={listing}
      ownerName={listing.lessorNm}
      ownerImage={normalizeImageUrl(listing.lessorProfileImg)}
      preferredTime={listing.aucAvailable}
      ownerDescription={listing.content}
    />
  )
}
