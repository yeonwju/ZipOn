import ListingDetailProfile from '../detail/ListingDetailProfile'

interface BrokerOwnerInfoProps {
  ownerName: string
  ownerImage?: string
  preferredTime?: string
  ownerDescription?: string
}

export default function BrokerOwnerInfo({
  ownerName,
  ownerImage = '/profile.svg',
  preferredTime,
  ownerDescription,
}: BrokerOwnerInfoProps) {
  return (
    <div className="rounded-2xl border border-gray-300 bg-gray-50 p-4">
      <h3 className="mb-3 text-base font-semibold text-gray-900">집주인 정보</h3>

      <ListingDetailProfile imgSrc={ownerImage} name={ownerName} className="mb-4 font-medium" />

      {preferredTime && (
        <div className="mb-3 rounded-lg border border-gray-200 bg-white p-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">희망 방송시간</span>
            <span className="font-medium text-gray-900">{preferredTime}</span>
          </div>
        </div>
      )}

      {ownerDescription && (
        <div className="rounded-lg border border-gray-200 bg-white p-3">
          <p className="text-sm text-gray-700">{ownerDescription}</p>
        </div>
      )}
    </div>
  )
}
