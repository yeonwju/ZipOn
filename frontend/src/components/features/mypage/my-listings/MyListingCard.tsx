import Image from 'next/image'

import { MyPropertiesData } from '@/types/api/mypage'

interface MyListingCardProps {
  className?: string
  propertyData: MyPropertiesData
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

export default function MyListingCard({ className, propertyData }: MyListingCardProps) {
  const priceText =
    propertyData.mnRent > 0
      ? `${propertyData.deposit.toLocaleString()} / ${propertyData.mnRent.toLocaleString()}`
      : `${propertyData.deposit.toLocaleString()}`

  return (
    <div className="flex w-full flex-col rounded-lg border border-gray-200 bg-white p-2.5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-row items-center gap-2.5">
        {/* 이미지 */}
        <div className="relative w-24 flex-shrink-0">
          <Image
            src={propertyData.thumbnail || '/listing.svg'}
            alt="매물 이미지"
            width={96}
            height={96}
            className="h-24 w-24 rounded-md object-cover"
          />
        </div>

        {/* 텍스트 정보 */}
        <div className="flex flex-1 flex-col gap-0.5">
          {/* 상단: 건물 타입 뱃지 */}
          <div className="flex items-center gap-1">
            <div className="inline-flex items-center rounded-full bg-gray-100 px-1.5 py-0.5">
              <span className="text-[10px] font-medium text-gray-700">
                {getBuildingTypeText(propertyData.buildingType)}
              </span>
            </div>
          </div>

          {/* 주소 */}
          <span className="line-clamp-1 text-sm font-semibold text-gray-900">
            {propertyData.address}
          </span>

          {/* 가격 */}
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-xs text-gray-500">
              {propertyData.mnRent > 0 ? '월세' : '전세'}
            </span>
            <span className="text-base font-bold text-blue-600">{priceText}</span>
            <span className="text-xs text-gray-500">만원</span>
          </div>

          {/* 버튼 영역 */}
          <div className="mt-1.5 flex gap-1.5">
            <button className="flex-1 rounded border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50">
              수정
            </button>
            <button className="flex-1 rounded border border-red-300 bg-white px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50">
              삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
