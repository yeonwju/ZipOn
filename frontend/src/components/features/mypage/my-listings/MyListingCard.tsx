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
    pending: { text: '중개 대기', color: 'bg-yellow-100 text-yellow-700' },
    success: { text: '중개 완료', color: 'bg-green-100 text-green-700' },
    fail: { text: '중개 실패', color: 'bg-red-100 text-red-700' },
  }

  const config = statusConfig[status as keyof typeof statusConfig]
  if (!config) return null

  return (
    <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 ${config.color}`}>
      <span className="text-xs font-medium">{config.text}</span>
    </div>
  )
}

export default function MyListingCard({ className, myListing }: MyListingCardProps) {
  const priceText =
    myListing.rent > 0
      ? `${myListing.deposit.toLocaleString()} / ${myListing.rent.toLocaleString()}`
      : `${myListing.deposit.toLocaleString()}`

  return (
    <div className="flex w-full flex-col rounded-md border border-gray-200 p-3 shadow-sm">
      <div className="flex flex-row items-start gap-3">
        {/* 이미지 */}
        <div className="relative flex-1">
          <Image
            src="/listing.svg"
            alt="매물 이미지"
            width={200}
            height={200}
            className="w-full rounded-md border border-gray-100 object-cover"
          />

          {/* 뱃지 영역 */}
          <div className="mt-2.5 flex flex-row items-start gap-1">
            {/* 경매 여부 */}
            {myListing.isAuction && (
              <div className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5">
                <span className="text-xs font-medium text-red-700">경매</span>
              </div>
            )}

            {/* 중개 상태 */}
            {getBrokerStatusBadge(myListing.connectBroker)}
          </div>
        </div>

        {/* 텍스트 정보 */}
        <div className="flex flex-1 flex-col gap-1">
          <span className="text-xs text-gray-500">{myListing.buildingType}</span>
          <span className="line-clamp-2 text-sm font-semibold text-gray-800">
            {myListing.address}
          </span>
          {myListing.detailAddress && (
            <span className="text-xs text-gray-400">{myListing.detailAddress}</span>
          )}

          {/* 가격 */}
          <div className="mt-2 flex flex-col gap-0.5">
            <span className="text-xs text-gray-500">{myListing.rent > 0 ? '월세' : '전세'}</span>
            <span className="text-lg font-bold text-blue-600">
              {priceText}
              <span className="text-sm font-normal text-gray-500">만원</span>
            </span>
          </div>
        </div>
      </div>

      {/* 하단 버튼 영역 */}
      {myListing.connectBroker !== 'success' && (
        <div className="mt-3 flex w-full justify-center gap-2">
          <button className="flex-1 rounded-md border border-gray-200 bg-white px-3 py-1 text-sm font-semibold text-gray-700 hover:bg-gray-50">
            수정하기
          </button>
          <button className="flex-1 rounded-md border border-red-200 bg-white px-3 py-1 text-sm font-semibold text-red-600 hover:bg-red-50">
            삭제하기
          </button>
        </div>
      )}
    </div>
  )
}
