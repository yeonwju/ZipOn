'use client'

import { Accordion } from '@/components/ui/accordion'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'
import useUserLocation from '@/hook/map/useUserLocation'
import useKakaoLoader from '@/hook/map/useKakaoLoader'
import Step1PropertyVerification from '@/components/listings/Step1PropertyVerification'
import Step2PropertyInfo from '@/components/listings/Step2PropertyInfo'
import Step3AdditionalInfo from '@/components/listings/Step3AdditionalInfo'

export default function NewListingPage() {
  useKakaoLoader()
  const { refresh: refreshLocation, isRefreshing } = useUserLocation()

  // Step1 데이터
  const [addressCoords, setAddressCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [baseAddress, setBaseAddress] = useState<string>('') // 기본 주소
  const [detailAddress, setDetailAddress] = useState<string>('') // 상세 주소
  const [files, setFiles] = useState<File[]>([])

  // 단계별 완료 상태
  const [step1Completed, setStep1Completed] = useState(false)
  const [step2Completed, setStep2Completed] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [currentAccordion, setCurrentAccordion] = useState('item-1')

  // Step2 매물 정보 상태
  const [listingInfo, setListingInfo] = useState({
    lessorNm: '',
    propertyNm: '',
    content: '',
    area: '',
    areaP: '',
    deposit: '',
    mnRent: '',
    fee: '',
    period: '',
    floor: '',
    facing: 'N',
    roomCnt: '',
    bathroomCnt: '',
    constructionDate: '',
    parkingCnt: '',
    hasElevator: false,
    petAvailable: false,
    isAucPref: false,
    isBrkPref: false,
    aucAt: '',
    aucAvailable: '',
  })

  // Step3 추가 정보 상태
  const [additionalInfo, setAdditionalInfo] = useState({
    images: [] as File[],
    notes: '',
  })

  // 인증 버튼 활성화 조건 (주소 + 상세주소 + 파일)
  const canVerify = !!(
    addressCoords !== null &&
    baseAddress.trim() &&
    detailAddress.trim() &&
    files.length > 0 &&
    !step1Completed
  )

  // Step1 핸들러들
  const handleAddressSelect = (selectedAddress: string, coords: { lat: number; lng: number }) => {
    setBaseAddress(selectedAddress)
    setAddressCoords(coords)
    console.log('✅ Step1 - 주소 선택:', selectedAddress, coords)
  }

  const handleDetailAddressChange = (detail: string) => {
    setDetailAddress(detail)
    console.log('✅ Step1 - 상세주소 입력:', detail)
  }

  const handleFileChange = (newFiles: File[]) => {
    setFiles(newFiles)
    console.log('✅ Step1 - 파일 변경:', newFiles.map(f => f.name))
  }

  const handleVerify = () => {
    if (!canVerify) return
    setIsVerifying(true)

    const fullAddress = `${baseAddress} ${detailAddress}`
    console.log('✅ Step1 - 인증 시작:', {
      fullAddress,
      files: files.map(f => f.name),
      coords: addressCoords,
    })

    // 실제로는 API 호출 (여기선 시뮬레이션)
    setTimeout(() => {
      setStep1Completed(true)
      setIsVerifying(false)
      setCurrentAccordion('item-2')
      console.log('✅ Step1 - 인증 완료')
    }, 1000)
  }

  // Step2 핸들러
  const handleListingInfoChange = (info: typeof listingInfo) => {
    setListingInfo(info)
    console.log('✅ Step2 - 매물 정보 변경:', info)
  }

  // Step3 핸들러
  const handleAdditionalInfoChange = (info: typeof additionalInfo) => {
    setAdditionalInfo(info)
    console.log('✅ Step3 - 추가 정보 변경:', info)
  }

  // 매물 정보 입력 완료 조건
  const canCompleteStep2 = !!(
    listingInfo.lessorNm &&
    listingInfo.propertyNm &&
    listingInfo.content &&
    listingInfo.area &&
    listingInfo.deposit &&
    listingInfo.mnRent &&
    listingInfo.roomCnt &&
    listingInfo.bathroomCnt
  )

  // 최종 제출
  const handleSubmit = async () => {
    const fullAddress = `${baseAddress} ${detailAddress}`.trim()

    const formData = {
      // Step1 데이터
      address: fullAddress,
      latitude: addressCoords?.lat || 0,
      longitude: addressCoords?.lng || 0,
      verificationFiles: files.map(file => file.name),

      // Step2 데이터
      lessorNm: listingInfo.lessorNm,
      propertyNm: listingInfo.propertyNm,
      content: listingInfo.content,
      area: parseFloat(listingInfo.area) || 0,
      areaP: parseFloat(listingInfo.areaP) || 0,
      deposit: parseInt(listingInfo.deposit) || 0,
      mnRent: parseInt(listingInfo.mnRent) || 0,
      fee: parseInt(listingInfo.fee) || 0,
      period: parseInt(listingInfo.period) || 0,
      floor: parseInt(listingInfo.floor) || 0,
      facing: listingInfo.facing,
      roomCnt: parseInt(listingInfo.roomCnt) || 0,
      bathroomCnt: parseInt(listingInfo.bathroomCnt) || 0,
      constructionDate: listingInfo.constructionDate,
      parkingCnt: parseInt(listingInfo.parkingCnt) || 0,
      hasElevator: listingInfo.hasElevator,
      petAvailable: listingInfo.petAvailable,
      isAucPref: listingInfo.isAucPref,
      isBrkPref: listingInfo.isBrkPref,
      aucAt: listingInfo.aucAt,
      aucAvailable: listingInfo.aucAvailable,

      // Step3 데이터
      images: additionalInfo.images.map(img => img.name),
      notes: additionalInfo.notes,
    }

    console.log('🚀 최종 제출 데이터:', formData)
    alert('매물 등록이 완료되었습니다!')
  }

  return (
    <>
      <div className="mx-auto w-full max-w-4xl py-4 pb-32">
        <Accordion
          type="single"
          collapsible
          className="w-full space-y-6"
          value={currentAccordion}
          onValueChange={value => {
            if ((value === 'item-2' || value === 'item-3') && !step1Completed) return
            setCurrentAccordion(value)
          }}
        >
          <Step1PropertyVerification
            step1Completed={step1Completed}
            isVerifying={isVerifying}
            baseAddress={baseAddress}
            detailAddress={detailAddress}
            addressCoords={addressCoords}
            files={files}
            canVerify={canVerify}
            onAddressSelect={handleAddressSelect}
            onDetailAddressChange={handleDetailAddressChange}
            onFileChange={handleFileChange}
            onVerify={handleVerify}
            refreshLocation={refreshLocation}
            isRefreshing={isRefreshing}
          />

          <Step2PropertyInfo
            step1Completed={step1Completed}
            listingInfo={listingInfo}
            canCompleteStep2={canCompleteStep2}
            onListingInfoChange={handleListingInfoChange}
            onComplete={() => {
              setStep2Completed(true)
              setCurrentAccordion('')
              console.log('✅ Step2 - 입력 완료')
            }}
          />

          <Step3AdditionalInfo
            step1Completed={step1Completed}
            additionalInfo={additionalInfo}
            onAdditionalInfoChange={handleAdditionalInfoChange}
          />
        </Accordion>
      </div>

      {/* 하단 고정 제출 버튼 */}
      {step1Completed && step2Completed && (
        <div className="fixed right-0 bottom-0 left-0 z-50 border-t border-gray-200 bg-white shadow-lg">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">모든 정보 입력 완료</p>
              <p className="text-xs text-gray-600">매물 등록을 완료하시겠습니까?</p>
            </div>
            <Button
              onClick={handleSubmit}
              size="lg"
              className="h-12 bg-blue-500 px-8 text-base font-bold text-white shadow-sm transition-all hover:bg-blue-600"
            >
              <CheckCircle2 size={20} className="mr-2" />
              매물 등록 완료
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
