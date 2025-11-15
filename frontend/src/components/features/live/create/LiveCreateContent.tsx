'use client'

import React, { useMemo, useState } from 'react'

import AddressSearch from '@/components/common/AddressSearch'
import {
  LiveCreateButton,
  LiveMapPreview,
  LiveTitleInput,
  SelectPicker,
} from '@/components/features/live'
import useKakaoLoader from '@/hooks/map/useKakaoLoader'
import useUserLocation from '@/hooks/map/useUserLocation'
import { useGetCanLiveAuctionList } from '@/hooks/queries/useLive'
import { calculateDistance } from '@/utils/distance'

export default function LiveCreateContent() {
  // 카카오맵 API 로드
  useKakaoLoader()
  const [addressCoords, setAddressCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [title, setTitle] = useState('')
  const [selectedAuctionSeq, setSelectedAuctionSeq] = useState<number | null>(null)

  // React Query로 라이브 가능한 경매 목록 조회
  const { data: auctionItems } = useGetCanLiveAuctionList()

  const { location: currentLocation, refresh: refreshLocation, isRefreshing } = useUserLocation()

  const distance = useMemo(() => {
    if (!currentLocation || !addressCoords) return null
    return calculateDistance(currentLocation, addressCoords)
  }, [currentLocation, addressCoords])

  const isWithinDistance = distance !== null && distance <= 100
  const hasTitleInput = title.trim() !== ''
  const hasSelectedAuction = selectedAuctionSeq !== null

  const canCreateLive =
    isWithinDistance &&
    hasTitleInput &&
    hasSelectedAuction &&
    addressCoords !== null &&
    currentLocation !== null

  const handleSelectAuction = (value: string) => {
    // value는 auctionSeq를 toLocaleString()으로 변환한 값 (예: "1,234")
    // 쉼표를 제거하고 숫자로 변환
    const auctionSeq = Number(value.replace(/,/g, ''))
    if (!isNaN(auctionSeq)) {
      setSelectedAuctionSeq(auctionSeq)
    }
  }

  const handleCreateLive = () => {
    if (!canCreateLive || !selectedAuctionSeq) return

    // TODO: 실제 라이브 방송 생성 API 호출
    console.log('라이브 방송 생성:', {
      title,
      auctionSeq: selectedAuctionSeq,
      addressCoords,
      currentLocation,
      distance,
    })
  }

  return (
    <>
      <section className="flex min-h-screen flex-col bg-gray-200 pb-32">
        <div className="mx-auto w-full max-w-2xl space-y-2 bg-white">
          <div>
            <LiveTitleInput value={title} onChange={setTitle} />
            <div className={'px-4 py-2'}>
              <AddressSearch onAddressSelect={(address, coords) => setAddressCoords(coords)} />
            </div>
            <SelectPicker
              title={'방송할 매물 선택'}
              description={'경매 대기 목록'}
              auctionItems={auctionItems ?? null}
              onSelect={handleSelectAuction}
            />
          </div>

          <LiveMapPreview
            currentLocation={currentLocation}
            addressCoords={addressCoords}
            distance={distance}
            onRefreshLocation={refreshLocation}
            isRefreshing={isRefreshing}
            isCurrentLocation={true}
            height={200}
          />
        </div>
      </section>

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
