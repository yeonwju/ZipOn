import Image from 'next/image'
import Link from 'next/link'

import { ROUTES } from '@/constants'
import { MyBrokerageData } from '@/types/api/mypage'
import { formatCurrency, normalizeThumbnailUrl } from '@/utils/format'

interface MyBrokerageCardProps {
  className?: string
  brokerageData: MyBrokerageData
}

// 상태 뱃지 표시
function getAuctionStatusBadge(status: string) {
  const statusConfig: Record<string, { text: string; color: string }> = {
    REQUESTED: { text: '요청됨', color: 'bg-yellow-100 text-yellow-700' },
    ACCEPTED: { text: '수락됨', color: 'bg-green-100 text-green-700' },
    CANCELED: { text: '취소됨', color: 'bg-red-100 text-red-700' },
    EXPIRED: { text: '만료됨', color: 'bg-gray-100 text-gray-700' },
  }

  const config = statusConfig[status]
  if (!config) return null

  return (
    <div className={`inline-flex items-center rounded-full px-1.5 py-0.5 ${config.color}`}>
      <span className="text-[10px] font-medium">{config.text}</span>
    </div>
  )
}

// 빌딩 타입 한글 변환
function getBuildingTypeText(buildingType: string): string {
  const typeMap: Record<string, string> = {
    ROOM: '원룸/투룸',
    OFFICE: '오피스텔',
    APT: '아파트',
    VILLA: '빌라',
  }
  return typeMap[buildingType] || buildingType
}

export default function MyBrokerageCard({ className, brokerageData }: MyBrokerageCardProps) {
  const priceText =
    brokerageData.mnRent > 0
      ? `${formatCurrency(brokerageData.deposit)} / ${formatCurrency(brokerageData.mnRent)}`
      : formatCurrency(brokerageData.deposit)

  const thumbnailUrl = normalizeThumbnailUrl(brokerageData.thumbnail, '/listing.svg')
  const isExternalUrl = thumbnailUrl.startsWith('https://')

  return (
    <div className="flex w-full flex-col rounded-lg border border-gray-200 bg-white p-2.5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-row items-center gap-2.5">
        {/* 이미지 */}
        <div className="relative w-24 flex-shrink-0">
          <Image
            src={thumbnailUrl}
            alt="매물 이미지"
            width={96}
            height={96}
            className="h-24 w-24 rounded-md object-cover"
            unoptimized={isExternalUrl}
          />
        </div>

        {/* 텍스트 정보 */}
        <div className="flex flex-1 flex-col gap-0.5">
          {/* 상단: 경매 상태 + 건물 타입 뱃지 */}
          <div className="flex flex-wrap items-center gap-1">
            {getAuctionStatusBadge(brokerageData.auctionStatus)}
            <div className="inline-flex items-center rounded-full bg-gray-100 px-1.5 py-0.5">
              <span className="text-[10px] font-medium text-gray-700">
                {getBuildingTypeText(brokerageData.buildingType)}
              </span>
            </div>
          </div>

          {/* 주소 */}
          <span className="line-clamp-1 text-sm font-semibold text-gray-900">
            {brokerageData.address}
          </span>

          {/* 가격 */}
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-xs text-gray-500">
              {brokerageData.mnRent > 0 ? '월세' : '전세'}
            </span>
            <span className="text-base font-bold text-blue-600">{priceText}</span>
          </div>

          {/* 버튼 영역 */}
          <div className="mt-1.5 flex gap-1.5">
            <Link
              href={ROUTES.LISTING_DETAIL(brokerageData.propertySeq)}
              className="flex-1 rounded border border-gray-300 bg-white px-2 py-1 text-center text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              상세
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
