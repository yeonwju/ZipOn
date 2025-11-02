'use client'

import React, { useEffect, useState } from 'react'
import DaumPostcode from 'react-daum-postcode'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface AddressSearchProps {
  /** 주소 선택 완료 시 호출되는 콜백 */
  onAddressSelect: (address: string, coords: { lat: number; lng: number }) => void
  /** 초기 주소 값 */
  defaultValue?: string
  /** 에러 표시 */
  error?: string | null
  /** 로딩 상태 */
  isLoading?: boolean
}

interface DaumPostcodeData {
  address: string
  roadAddress: string
  jibunAddress: string
  zonecode: string
}

/**
 * Daum 주소 검색 컴포넌트
 *
 * react-daum-postcode 라이브러리와 shadcn/ui Dialog를 사용하여
 * 주소를 검색하고, 선택한 주소를 자동으로 좌표로 변환합니다.
 *
 * @example
 * ```tsx
 * <AddressSearch
 *   onAddressSelect={(address, coords) => {
 *     console.log('주소:', address)
 *     console.log('좌표:', coords)
 *   }}
 * />
 * ```
 */
export default function AddressSearch({
  onAddressSelect,
  defaultValue = '',
  error,
  isLoading = false,
}: AddressSearchProps) {
  const [address, setAddress] = useState(defaultValue)
  const [searchedAddress, setSearchedAddress] = useState<string | null>(null)
  const [localError, setLocalError] = useState<string | null>(null)
  const [isConverting, setIsConverting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  /**
   * 주소 선택 완료 핸들러
   */
  const handleAddressComplete = (data: DaumPostcodeData) => {
    // 선택한 주소 (도로명 주소 우선)
    const selectedAddress = data.roadAddress || data.jibunAddress

    setAddress(selectedAddress)
    setLocalError(null)
    setIsDialogOpen(false)

    // 주소를 좌표로 변환
    convertAddressToCoords(selectedAddress)
  }

  /**
   * 카카오 주소 검색 API를 사용하여 주소를 좌표로 변환
   */
  const convertAddressToCoords = (addressText: string) => {
    if (!window.kakao?.maps?.services) {
      setLocalError('카카오맵 API가 로드되지 않았습니다.')
      return
    }

    setIsConverting(true)

    const geocoder = new window.kakao.maps.services.Geocoder()

    geocoder.addressSearch(addressText, (result, status) => {
      setIsConverting(false)

      if (status === window.kakao.maps.services.Status.OK) {
        const coords = {
          lat: parseFloat(result[0].y),
          lng: parseFloat(result[0].x),
        }
        setSearchedAddress(result[0].address_name)
        setLocalError(null)

        // 부모 컴포넌트에 결과 전달
        onAddressSelect(addressText, coords)
      } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
        setLocalError('검색 결과가 없습니다. 정확한 주소를 입력해주세요.')
      } else {
        setLocalError('주소 검색 중 오류가 발생했습니다.')
      }
    })
  }

  // 외부에서 전달된 defaultValue가 변경되면 반영
  useEffect(() => {
    setAddress(defaultValue)
  }, [defaultValue])

  const displayError = error || localError
  const displayLoading = isLoading || isConverting

  return (
    <>
      <div className="bg-white px-4 pb-4">
        <label className="mb-2 flex items-center text-sm font-medium text-gray-700">
          매물 주소 <span className="text-red-500">*</span>
        </label>

        <div className="flex gap-2">
          <input
            type="text"
            value={address}
            readOnly
            onClick={() => setIsDialogOpen(true)}
            placeholder="클릭하여 주소를 검색하세요"
            className="flex-1 cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm transition-colors outline-none hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* 에러 메시지 */}
        {displayError && (
          <div className="mt-3 rounded-md bg-red-50 px-4 py-3 text-sm text-red-600">
            {displayError}
          </div>
        )}

        {/* 검색 중 표시 */}
        {displayLoading && (
          <div className="mt-3 rounded-md bg-gray-50 px-4 py-3 text-sm text-gray-600">
            주소를 좌표로 변환하는 중...
          </div>
        )}

        {/* 검색 결과 */}
      </div>

      {/* 주소 검색 Dialog (shadcn/ui) */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[90vh] bg-white px-2">
          <DialogHeader className="flex items-center justify-center py-4">
            <DialogTitle className={'text-md'}>주소 검색</DialogTitle>
          </DialogHeader>

          {/* DaumPostcode 컴포넌트 */}
          <div className="h-[500px] w-full">
            <DaumPostcode
              onComplete={handleAddressComplete}
              autoClose={false}
              style={{
                width: '100%',
                height: '100%',
              }}
              theme={{
                bgColor: '#FFFFFF',
                searchBgColor: '#FFFFFF',
                contentBgColor: '#FFFFFF',
                textColor: '#000000',
                queryTextColor: '#000000',
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
