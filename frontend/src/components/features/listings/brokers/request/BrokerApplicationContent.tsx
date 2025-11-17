'use client'

import { useParams } from 'next/navigation'

import { BrokerApplicationDetail } from '@/components/features/listings/brokers'
import { useSearchListingDetail } from '@/hooks/queries/useListing'

export default function BrokerApplicationContent() {
  const params = useParams()

  // TODO: React Query useSuspenseQuery로 교체
  const listing = useSearchListingDetail(Number(params.id))

  return (
    <BrokerApplicationDetail
      listing={listing.data?.success === true ? listing.data.data : undefined}
      ownerName={listing.data?.success === true ? listing.data.data.lessorNm : ''}
      ownerImage={listing.data?.success === true ? listing.data.data.lessorProfileImg : ''}
      preferredTime={listing.data?.success === true ? listing.data.data.aucAvailable : ''}
      ownerDescription={listing.data?.success === true ? listing.data.data.content : ''}
    />
  )
}
