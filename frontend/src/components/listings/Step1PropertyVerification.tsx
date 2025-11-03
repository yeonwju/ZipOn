'use client'

import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import AddressSearch from '@/components/common/AddressSearch'
import LiveMapPreview from '@/components/live/LiveMapPreview'
import { CheckCircle2, Cloudy, X } from 'lucide-react'
import React, { useRef } from 'react'

interface Step1Props {
  step1Completed: boolean
  isVerifying: boolean
  address: string
  addressCoords: { lat: number; lng: number } | null
  file: File | null
  canVerify: boolean
  onAddressSelect: (address: string, coords: { lat: number; lng: number }) => void
  onFileChange: (file: File | null) => void
  onVerify: () => void
  refreshLocation: () => void
  isRefreshing: boolean
}

export default function Step1PropertyVerification({
  step1Completed,
  isVerifying,
  address,
  addressCoords,
  file,
  canVerify,
  onAddressSelect,
  onFileChange,
  onVerify,
  refreshLocation,
  isRefreshing,
}: Step1Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleFileClick = () => fileInputRef.current?.click()
  const handleRemoveFile = () => {
    onFileChange(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) onFileChange(selected)
  }

  return (
    <AccordionItem
      value="item-1"
      className="border-0 border-b border-gray-200 pb-6"
      disabled={step1Completed}
    >
      <AccordionTrigger
        className="mb-6 py-0 text-xl font-bold text-gray-900 hover:no-underline"
        disabled={step1Completed}
      >
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white">
            1
          </span>
          <span>매물 인증</span>
          {step1Completed && (
            <Badge variant="secondary" className="border-0 bg-green-500 text-white">
              <CheckCircle2 size={14} className="mr-1" />
              완료
            </Badge>
          )}
        </div>
      </AccordionTrigger>

      <AccordionContent className="flex flex-col gap-8 pt-4">
        {/* 주소 선택 */}
        <div>
          <AddressSearch
            title="매물 주소"
            onAddressSelect={(selectedAddress, coords) => {
              onAddressSelect(selectedAddress, coords)
            }}
          />
          {addressCoords && (
            <div className="mt-6">
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
        </div>

        {/* 등기부 등본 업로드 */}
        <div>
          <label className="mb-3 block text-sm font-medium text-gray-900">
            등기부 등본 <span className="text-red-500">*</span>
          </label>
          <Empty className="group flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-8 text-center transition-all hover:border-blue-500 hover:bg-blue-50">
            {!file ? (
              <>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Cloudy
                      className="text-gray-400 transition-colors group-hover:text-blue-500"
                      size={32}
                    />
                  </EmptyMedia>
                  <EmptyTitle className="mt-3 text-base font-medium text-gray-900">
                    파일을 업로드하세요
                  </EmptyTitle>
                  <EmptyDescription className="mt-1 text-sm text-gray-500">
                    PDF, JPG, PNG 파일을 업로드할 수 있습니다
                  </EmptyDescription>
                </EmptyHeader>

                <EmptyContent>
                  <Button
                    type="button"
                    onClick={handleFileClick}
                    className="mt-4 h-10 bg-blue-500 px-6 text-sm font-semibold text-white hover:bg-blue-600"
                  >
                    파일 선택
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </EmptyContent>
              </>
            ) : (
              <div className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                    <Cloudy className="text-blue-500" size={20} />
                  </div>
                  <span className="truncate text-sm font-medium text-gray-900">{file.name}</span>
                </div>
                <button
                  onClick={handleRemoveFile}
                  className="text-gray-400 transition hover:text-red-500"
                  aria-label="파일 삭제"
                >
                  <X size={20} />
                </button>
              </div>
            )}
          </Empty>
        </div>

        {/* 인증 버튼 */}
        <div className="flex justify-end pt-4">
          <Button
            onClick={onVerify}
            disabled={!canVerify || isVerifying}
            size="lg"
            className="h-12 bg-blue-500 px-8 text-base font-semibold text-white hover:bg-blue-600 disabled:bg-gray-200 disabled:text-gray-400"
          >
            {isVerifying ? (
              <>
                <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                인증 중...
              </>
            ) : canVerify && !step1Completed ? (
              <>
                <CheckCircle2 size={20} className="mr-2" />
                인증하기
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
