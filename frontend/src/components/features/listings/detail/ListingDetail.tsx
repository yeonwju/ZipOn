'use client'

import { useUser } from '@/hooks/queries'
import { useSearchListingDetail } from '@/hooks/queries/useListing'
import { getListingButtonConfig, isLiveTimePassed } from '@/utils/listingButtons'

import ListingDescription from './ListingDescription'
import ListingFeatures from './ListingFeatures'
import ListingImageGallery from './ListingImageGallery'
import ListingInfo from './ListingInfo'

interface ListingDetailProps {
  propertySeq: number
}

/**
 * 매물 상세 정보 컴포넌트
 *
 * 매물의 모든 정보를 섹션별로 나누어 표시합니다.
 * - 이미지 갤러리
 * - 기본 정보 (가격, 주소, 면적 등)
 * - 상세 설명
 * - 특징/옵션
 * - 하단 액션 버튼
 */
export default function ListingDetail({ propertySeq }: ListingDetailProps) {
  const { data: response, isLoading, isError } = useSearchListingDetail(propertySeq)
  const { data: user } = useUser()

  // 로딩 중
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    )
  }

  // 에러 또는 데이터 없음
  if (isError || !response?.success) {
    const errorMessage =
      response && !response.success ? response.message : '매물 정보를 불러올 수 없습니다.'
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-red-500">{errorMessage || '매물 정보를 불러올 수 없습니다.'}</p>
      </div>
    )
  }

  const result = response.data

  // 버튼 설정 가져오기
  const buttonConfig = isLiveTimePassed(result.liveAt)
    ? null // 라이브 시작 시간이 지나면 버튼 표시 안 함
    : getListingButtonConfig(
        result.isAucPref,
        result.isBrkPref,
        result.hasBrk,
        result.lessorSeq,
        result.brkSeq,
        user?.userSeq,
        result.auctionSeq,
        propertySeq
      )

  // 특징 배열 생성
  const features: string[] = []
  if (result.hasElevator) features.push('엘리베이터')
  if (result.petAvailable) features.push('반려동물 가능')
  if (result.parkingCnt && Number(result.parkingCnt) > 0)
    features.push(`주차 ${result.parkingCnt}대`)
  if (result.isAucPref) features.push('경매 선호')
  if (result.isBrkPref) features.push('중개 선호')

  return (
    <div className="h-full">
      {/* 컨텐츠 */}
      <main>
        {/* 이미지 갤러리 */}
        <ListingImageGallery images={result.images} />
        {/* 기본 정보 */}
        <ListingInfo
          name={result.propertyNm}
          deposit={result.deposit}
          rent={result.mnRent}
          type={result.buildingType}
          area={result.area}
          floor={String(result.floor)}
          totalFloor={String(result.floor)}
          availableDate={String(result.period)}
          address={result.address}
        />

        {/* 특징/옵션 */}
        <ListingFeatures features={features} />

        {/* 상세 설명 */}
        <ListingDescription description={result.content} />
      </main>

      {/* 고정 하단 버튼 - liveAt 지나면 표시 안 함 */}
      {buttonConfig && (
        <footer
          className="fixed right-0 bottom-0 left-0 z-50 bg-white px-4 py-3 shadow-lg"
          style={{
            paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
          }}
        >
          <div className="flex gap-2">
            {/* 주 버튼 */}
            <button
              onClick={buttonConfig.primary.action}
              className="flex-1 rounded-lg bg-blue-500 py-4 font-semibold text-white transition-colors hover:bg-blue-600"
            >
              {buttonConfig.primary.text}
            </button>

            {/* 수정 버튼 (있을 경우) */}
            {buttonConfig.secondary && (
              <button
                onClick={buttonConfig.secondary.action}
                className="w-20 rounded-lg border-2 border-blue-500 bg-white py-4 font-semibold text-blue-500 transition-colors hover:bg-blue-50"
              >
                {buttonConfig.secondary.text}
              </button>
            )}

            {/* 삭제 버튼 (있을 경우) */}
            {buttonConfig.delete && (
              <button
                onClick={buttonConfig.delete.action}
                className="w-20 rounded-lg border-2 border-red-500 bg-white py-4 font-semibold text-red-500 transition-colors hover:bg-red-50"
              >
                {buttonConfig.delete.text}
              </button>
            )}
          </div>
        </footer>
      )}
    </div>
  )
}
