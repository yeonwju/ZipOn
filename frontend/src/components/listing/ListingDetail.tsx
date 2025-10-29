'use client'

import ListingDescription from './ListingDescription'
import ListingFeatures from './ListingFeatures'
import ListingImageGallery from './ListingImageGallery'
import ListingInfo from './ListingInfo'

interface ListingData {
  id: string
  name: string
  address: string
  deposit: number
  rent: number
  type: string
  area: number
  floor: number
  totalFloor: number
  description: string
  images: string[]
  features: string[]
  availableDate: string
}

interface ListingDetailProps {
  listing: ListingData
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
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 컨텐츠 */}
      <main>
        {/* 이미지 갤러리 */}
        <ListingImageGallery images={listing.images} />

        {/* 기본 정보 */}
        <ListingInfo
          name={listing.name}
          deposit={listing.deposit}
          rent={listing.rent}
          type={listing.type}
          area={listing.area}
          floor={listing.floor}
          totalFloor={listing.totalFloor}
          availableDate={listing.availableDate}
        />

        {/* 주소 */}
        <section className="bg-white px-4 py-4">
          <h2 className="mb-2 text-sm font-semibold text-gray-700">위치</h2>
          <p className="text-base text-gray-900">{listing.address}</p>
        </section>

        {/* 상세 설명 */}
        <ListingDescription description={listing.description} />

        {/* 특징/옵션 */}
        <ListingFeatures features={listing.features} />
      </main>

      {/* 고정 하단 버튼 */}
      <footer
        className="fixed right-0 bottom-0 left-0 z-50 bg-white px-4 py-3 shadow-lg"
        style={{
          paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
        }}
      >
        <button className="w-full rounded-lg bg-blue-600 py-4 font-semibold text-white transition-colors hover:bg-blue-700">
          문의하기
        </button>
      </footer>
    </div>
  )
}
