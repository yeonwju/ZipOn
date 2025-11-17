'use client'

import React, { useEffect, useState } from 'react'
import DaumPostcode from 'react-daum-postcode'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DaumPostcodeData } from '@/types/daum'

interface AddressSearchProps {
  /** 주소 선택 완료 시 호출되는 콜백 */
  onAddressSelect: (address: string, coords: { lat: number; lng: number }) => void
  /** 초기 주소 값 */
  defaultValue?: string
  /** 에러 표시 */
  error?: string | null
  /** 로딩 상태 */
  isLoading?: boolean
  title?: string
}

/**
 * 📍 Daum 주소 검색 컴포넌트 (지번 우선, 도로명 대체)
 *
 * 1️⃣ 지번 주소(jibunAddress)가 있으면 지번 주소 사용
 * 2️⃣ 없으면 도로명 주소(roadAddress) 사용
 * 3️⃣ 둘 다 없으면 에러 표시
 */
export default function AddressSearch({
  onAddressSelect,
  defaultValue = '',
  error,
  isLoading = false,
  title,
}: AddressSearchProps) {
  const [address, setAddress] = useState(defaultValue)
  const [searchedAddress, setSearchedAddress] = useState<string | null>(null)
  const [localError, setLocalError] = useState<string | null>(null)
  const [isConverting, setIsConverting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  /**
   * 주소 선택 완료 핸들러 (지번 → 도로명 순으로)
   */
  const handleAddressComplete = (data: DaumPostcodeData) => {
    // ✅ 지번 우선, 없으면 도로명 사용
    const selectedAddress = data.jibunAddress || data.roadAddress

    if (!selectedAddress) {
      setLocalError('유효한 주소를 찾을 수 없습니다. 다른 주소를 선택해주세요.')
      return
    }

    setAddress(selectedAddress)
    setLocalError(null)
    setIsDialogOpen(false)

    // 좌표 변환
    convertAddressToCoords(selectedAddress)
  }

  /**
   * 카카오맵 API 로드 대기 함수
   */
  const waitForKakaoMaps = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (window.kakao?.maps?.services) {
        resolve()
        return
      }

      let attempts = 0
      const maxAttempts = 50 // 5초 (100ms * 50)

      const checkKakao = setInterval(() => {
        attempts++
        if (window.kakao?.maps?.services) {
          clearInterval(checkKakao)
          resolve()
        } else if (attempts >= maxAttempts) {
          clearInterval(checkKakao)
          reject(new Error('카카오맵 API 로드 시간 초과'))
        }
      }, 100)
    })
  }

  /**
   * 카카오 주소 검색 API로 주소를 좌표로 변환
   */
  const convertAddressToCoords = async (addressText: string) => {
    setIsConverting(true)
    setLocalError(null)

    try {
      await waitForKakaoMaps()

      const geocoder = new window.kakao.maps.services.Geocoder()

      geocoder.addressSearch(addressText, (result, status) => {
        setIsConverting(false)

        if (status === window.kakao.maps.services.Status.OK) {
          const coords = {
            lat: parseFloat(result[0].y),
            lng: parseFloat(result[0].x),
          }

          // ✅ 지번 주소 우선, 없으면 도로명으로 fallback
          const jibunAddress = result[0].address?.address_name
          const roadAddress = result[0].road_address?.address_name
          const finalAddress = jibunAddress || roadAddress || addressText

          setSearchedAddress(finalAddress)
          setLocalError(null)

          onAddressSelect(finalAddress, coords)
        } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
          setLocalError('검색 결과가 없습니다. 정확한 주소를 입력해주세요.')
        } else {
          setLocalError('주소 검색 중 오류가 발생했습니다.')
        }
      })
    } catch (error) {
      setIsConverting(false)
      setLocalError('카카오맵 API를 불러오는 중 오류가 발생했습니다. 페이지를 새로고침해주세요.')
      console.error('카카오맵 로드 에러:', error)
    }
  }

  useEffect(() => {
    setAddress(defaultValue)
  }, [defaultValue])

  const displayError = error || localError
  const displayLoading = isLoading || isConverting

  return (
    <>
      <div>
        {title ? (
          <label className="mb-3 block text-sm font-medium text-gray-900">
            {title} <span className="text-red-500">*</span>
          </label>
        ) : (
          <label className="mb-3 block text-sm font-medium text-gray-900">
            매물 주소 <span className="text-red-500">*</span>
          </label>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            value={address}
            readOnly
            onClick={() => setIsDialogOpen(true)}
            placeholder="클릭하여 주소를 검색하세요 (지번 우선)"
            className="flex-1 cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm transition-colors outline-none placeholder:text-gray-400 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {displayError && (
          <div className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {displayError}
          </div>
        )}

        {displayLoading && (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-600">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
            <span>주소를 좌표로 변환하는 중...</span>
          </div>
        )}
      </div>

      {/* 주소 검색 Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[90vh] bg-white px-2">
          <DialogHeader className="flex items-center justify-center py-4">
            <DialogTitle className="text-md">주소 검색 (지번 우선)</DialogTitle>
          </DialogHeader>

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
