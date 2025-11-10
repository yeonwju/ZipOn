'use client'

import React, { useMemo, useState } from 'react'

import AddressSearch from '@/components/common/AddressSearch'
import { LiveCreateButton, LiveMapPreview, LiveTitleInput, SelectPicker } from '@/components/features/live'
import useUserLocation from '@/hooks/map/useUserLocation'
import { calculateDistance } from '@/utils/distance'

export default function LiveCreateContent() {
  const [addressCoords, setAddressCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [title, setTitle] = useState('')

  // TODO: React Query useSuspenseQuery로 교체
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

  const { location: currentLocation, refresh: refreshLocation, isRefreshing } = useUserLocation()

  const distance = useMemo(() => {
    if (!currentLocation || !addressCoords) return null
    return calculateDistance(currentLocation, addressCoords)
  }, [currentLocation, addressCoords])

  const isWithinDistance = distance !== null && distance <= 100
  const hasTitleInput = title.trim() !== ''

  const canCreateLive =
    isWithinDistance && hasTitleInput && addressCoords !== null && currentLocation !== null

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
        <div className="mx-auto w-full max-w-2xl space-y-2 bg-white">
          <div>
            <LiveTitleInput value={title} onChange={setTitle} />
            <div className={'px-4 py-2'}>
              <AddressSearch onAddressSelect={(address, coords) => setAddressCoords(coords)} />
            </div>
            <SelectPicker
              title={'방송할 매물 선택'}
              description={'경매 대기 목록'}
              auctionItems={mockAuctionItems}
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

