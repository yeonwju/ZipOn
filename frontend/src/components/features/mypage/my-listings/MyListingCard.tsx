import Image from 'next/image'

import { MyListing } from '@/types'

interface MyListingCardProps {
  className?: string
  myListing: MyListing
}

// 중개 상태 표시
function getBrokerStatusBadge(status: string | null) {
  if (!status) return null

  const statusConfig = {
    pending: { text: '대기', color: 'bg-yellow-100 text-yellow-700' },
    success: { text: '완료', color: 'bg-green-100 text-green-700' },
    fail: { text: '실패', color: 'bg-red-100 text-red-700' },
  }

  const config = statusConfig[status as keyof typeof statusConfig]
  if (!config) return null

  return (
    <div className={`inline-flex items-center rounded-full px-1.5 py-0.5 ${config.color}`}>
      <span className="text-[10px] font-medium">{config.text}</span>
    </div>
  )
}

export default function MyListingCard({ className, myListing }: MyListingCardProps) {
  const priceText =
    myListing.rent > 0
      ? `${myListing.deposit.toLocaleString()} / ${myListing.rent.toLocaleString()}`
      : `${myListing.deposit.toLocaleString()}`

  return (
    <div className="flex w-full flex-col rounded-lg border border-gray-200 bg-white p-2.5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-row items-center gap-2.5">
        {/* 이미지 */}
        <div className="relative w-24 flex-shrink-0">
          <Image
            src="/listing.svg"
            alt="매물 이미지"
            width={96}
            height={96}
            className="h-24 w-24 rounded-md object-cover"
          />
        </div>

        {/* 텍스트 정보 */}
        <div className="flex flex-1 flex-col gap-0.5">
          {/* 상단: 건물 타입 + 뱃지들 */}
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium text-gray-500">{myListing.buildingType}</span>
            {myListing.isAuction && (
              <div className="inline-flex items-center rounded-full bg-red-100 px-1.5 py-0.5">
                <span className="text-[10px] font-medium text-red-700">경매</span>
              </div>
            )}
            {getBrokerStatusBadge(myListing.connectBroker)}
          </div>

          {/* 주소 */}
          <span className="line-clamp-1 text-sm font-semibold text-gray-900">
            {myListing.address}
          </span>
          {myListing.detailAddress && (
            <span className="text-xs text-gray-400">{myListing.detailAddress}</span>
          )}

          {/* 가격 */}
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-xs text-gray-500">{myListing.rent > 0 ? '월세' : '전세'}</span>
            <span className="text-base font-bold text-blue-600">{priceText}</span>
            <span className="text-xs text-gray-500">만원</span>
          </div>

          {/* 버튼 영역 */}
          {myListing.connectBroker !== 'success' && (
            <div className="mt-1.5 flex gap-1.5">
              <button className="flex-1 rounded border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50">
                수정
              </button>
              <button className="flex-1 rounded border border-red-300 bg-white px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50">
                삭제
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
