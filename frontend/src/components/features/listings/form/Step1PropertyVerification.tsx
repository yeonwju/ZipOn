'use client'

import { CheckCircle2 } from 'lucide-react'
import React from 'react'

import AddressSearch from '@/components/common/AddressSearch'
import FileUploadArea from '@/components/common/FileUploadArea'
import LiveMapPreview from '@/components/features/live/LiveMapPreview'
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Step1Props {
  step1Completed: boolean
  isVerifying: boolean
  baseAddress: string
  detailAddress: string
  addressCoords: { lat: number; lng: number } | null
  files: File[]
  canVerify: boolean
  onAddressSelect: (address: string, coords: { lat: number; lng: number }) => void
  onDetailAddressChange: (detail: string) => void
  onFileChange: (files: File[]) => void
  onVerify: () => void
  refreshLocation: () => void
  isRefreshing: boolean
}

export default function Step1PropertyVerification({
  step1Completed,
  isVerifying,
  baseAddress,
  detailAddress,
  addressCoords,
  files,
  canVerify,
  onAddressSelect,
  onDetailAddressChange,
  onFileChange,
  onVerify,
  refreshLocation,
  isRefreshing,
}: Step1Props) {
  return (
    <AccordionItem
      value="item-1"
      className="border-0 border-b border-gray-200 px-4 py-6"
      disabled={step1Completed}
    >
      <AccordionTrigger
        className="flex items-center py-0 text-xl font-bold text-gray-900 hover:no-underline"
        disabled={step1Completed}
      >
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white">
            1
          </span>
          <span>
            매물 인증 <span className="text-red-500">*</span>
          </span>
          {step1Completed && (
            <Badge variant="secondary" className="border-0 bg-green-500 text-white">
              <CheckCircle2 size={14} className="mr-1" />
              완료
            </Badge>
          )}
        </div>
      </AccordionTrigger>

      <AccordionContent className="flex flex-col gap-3 pt-4">
        {/* 주소 선택 */}
        <div>
          <AddressSearch
            title="매물 주소"
            onAddressSelect={(selectedAddress, coords) => {
              onAddressSelect(selectedAddress, coords)
            }}
          />
        </div>

        {/* 상세주소 입력 */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-900">
            상세주소 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={detailAddress}
            onChange={e => onDetailAddressChange(e.target.value)}
            placeholder="예: 101동 1503호"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
          />
        </div>

        {/* 지도 미리보기 */}
        {addressCoords && (
          <div>
            <LiveMapPreview
              addressCoords={addressCoords}
              onRefreshLocation={refreshLocation}
              isRefreshing={isRefreshing}
              distance={null}
              isCurrentLocation={false}
              height={200}
            />
          </div>
        )}

        {/* 📄 등기부 등본 업로드 */}
        <FileUploadArea files={files} onFilesChange={onFileChange} title="등기부등본" />

        {/* 인증 버튼 */}
        <div className="flex justify-end pt-2">
          <Button
            onClick={onVerify}
            disabled={!canVerify || isVerifying}
            size="lg"
            className="h-10 bg-blue-500 px-8 text-base font-semibold text-white hover:bg-blue-600 disabled:bg-gray-200 disabled:text-gray-400"
          >
            {isVerifying ? (
              <>
                <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                인증 중...
              </>
            ) : step1Completed ? (
              <>
                <CheckCircle2 size={20} className="mr-2" />
                인증 완료
              </>
            ) : (
              <>
                <CheckCircle2 size={20} className="mr-2" />
                인증하기
              </>
            )}
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
