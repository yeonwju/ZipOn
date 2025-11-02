'use client'

import React, { useMemo, useState } from 'react'

import AddressSearch from '@/components/common/AddressSearch'
import LiveAuctionPicker from '@/components/live/LiveAuctionPicker'
import LiveCreateButton from '@/components/live/LiveCreateButton'
import LiveMapPreview from '@/components/live/LiveMapPreview'
import LiveTitleInput from '@/components/live/LiveTitleInput'
import useUserLocation from '@/hook/map/useUserLocation'
import { calculateDistance } from '@/utils/distance'

/**
 * 라이브 방송 생성 페이지
 *
 * 방송 생성 시 매물 위치를 간단히 미리보기 형태로 보여줍니다.
 * - 카카오 주소 검색 API를 사용하여 주소를 좌표로 변환
 * - 현재 위치와 입력한 주소 위치를 함께 지도에 표시
 */
export default function LiveCreatePage() {
  const [addressCoords, setAddressCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [title, setTitle] = useState('')

  // selectbox 목데이터
  const mockAuctionItems = [
    { value: 'a1', title: '송파 푸르지오' },
    { value: 'a2', title: '노원 롯데캐슬' },
    { value: 'a3', title: '강남 래미안 루센티아' },
    { value: 'a4', title: '목동 하이페리온' },
    { value: 'a5', title: '마포 자이' },
    { value: 'a6', title: '잠실 리센츠' },
    { value: 'a7', title: '용산 센트럴파크' },
    { value: 'a8', title: '은평 롯데캐슬' },
    { value: 'a9', title: '위례 자이' },
    { value: 'a10', title: '청담 더 펜트하우스' },
  ]

  // 현재 위치 가져오기
  const { location: currentLocation, refresh: refreshLocation, isRefreshing } = useUserLocation()

  // 거리 계산 (미터 단위)
  const distance = useMemo(() => {
    if (!currentLocation || !addressCoords) return null
    return calculateDistance(currentLocation, addressCoords)
  }, [currentLocation, addressCoords])

  // 각 조건 검사
  const isWithinDistance = distance !== null && distance <= 100
  const hasTitleInput = title.trim() !== ''

  // 라이브 생성 가능 여부 (모든 조건 만족)
  const canCreateLive =
    isWithinDistance && hasTitleInput && addressCoords !== null && currentLocation !== null

  // 라이브 방송 시작 핸들러
  const handleCreateLive = () => {
    if (!canCreateLive) return

    // TODO: 실제 라이브 방송 생성 API 호출
    console.log('라이브 방송 생성:', {
      title,
      addressCoords,
      currentLocation,
      distance,
    })
  }

  return (
    <>
      <section className="flex min-h-screen flex-col bg-gray-200 pb-32">
        <div className="mx-auto w-full max-w-2xl space-y-2">
          <div>
            <LiveTitleInput value={title} onChange={setTitle} />
            <AddressSearch onAddressSelect={(address, coords) => setAddressCoords(coords)} />
            <LiveAuctionPicker auctionItems={mockAuctionItems} />
          </div>

          {/* 지도 미리보기 */}
          <LiveMapPreview
            currentLocation={currentLocation}
            addressCoords={addressCoords}
            distance={distance}
            onRefreshLocation={refreshLocation}
            isRefreshing={isRefreshing}
          />
        </div>
      </section>

      {/* 라이브 생성 버튼 - 하단 고정 */}
      <LiveCreateButton
        canCreateLive={canCreateLive}
        hasTitle={hasTitleInput}
        hasAddress={addressCoords !== null}
        hasCurrentLocation={currentLocation !== null}
        onClick={handleCreateLive}
      />
    </>
  )
}
