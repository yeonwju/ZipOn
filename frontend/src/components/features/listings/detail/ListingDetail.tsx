'use client'

import ListingDetailProfile from '@/components/features/listings/detail/ListingDetailProfile'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { ListingDetailData } from '@/types'

import ListingDescription from './ListingDescription'
import ListingFeatures from './ListingFeatures'
import ListingImageGallery from './ListingImageGallery'
import ListingInfo from './ListingInfo'

interface ListingDetailProps {
  listing: ListingDetailData
}

/**
 * 매물 상세 정보 컴포넌트
 *
 * 매물의 모든 정보를 섹션별로 나누어 표시합니다.
 * - 이미지 갤러리
 * - 기본 정보 (가격, 주소, 면적 등)
 * - 상세 설명
 * - 특징/옵션
 * - 위치 지도
 *
 * @param listing - 매물 데이터
 */
export default function ListingDetail({ listing }: ListingDetailProps) {
  // 특징 배열 생성
  const features: string[] = []
  if (listing.hasElevator) features.push('엘리베이터')
  if (listing.petAvailable) features.push('반려동물 가능')
  if (listing.parkingCnt && Number(listing.parkingCnt) > 0)
    features.push(`주차 ${listing.parkingCnt}대`)
  if (listing.isAucPref) features.push('경매 선호')
  if (listing.isBrkPref) features.push('중개 선호')

  return (
    <div className="h-full">
      {/* 컨텐츠 */}
      <main>
        {/* 이미지 갤러리 */}
        <ListingImageGallery images={listing.images} />
        {/* 기본 정보 */}
        <ListingInfo
          name={listing.propertyNm}
          deposit={listing.deposit}
          rent={listing.mnRent}
          type={listing.buildingType}
          area={listing.area}
          floor={listing.floor}
          totalFloor={listing.floor}
          availableDate={listing.period}
          address={listing.address}
        />

        {/* 특징/옵션 */}
        <ListingFeatures features={features} />

        {/* 상세 설명 */}
        <ListingDescription description={listing.content} />
      </main>

      {/* 고정 하단 버튼 */}
      <footer
        className="fixed right-0 bottom-0 left-0 z-50 bg-white px-4 py-3 shadow-lg"
        style={{
          paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
        }}
      >
        <button className="w-full rounded-lg bg-blue-400 py-4 font-semibold text-white transition-colors hover:bg-blue-500">
          문의하기
        </button>
      </footer>
    </div>
  )
}
