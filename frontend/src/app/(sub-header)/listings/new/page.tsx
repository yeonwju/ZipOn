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
  // 카카오맵 API 로드
  useKakaoLoader()
  
  const { refresh: refreshLocation, isRefreshing } = useUserLocation()
  const [addressCoords, setAddressCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [address, setAddress] = useState<string>('')
  const [file, setFile] = useState<File | null>(null)

  // 단계별 완료 상태
  const [step1Completed, setStep1Completed] = useState(false)
  const [step2Completed, setStep2Completed] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)

  // 현재 열려있는 아코디언
  const [currentAccordion, setCurrentAccordion] = useState('item-1')

  // 매물 정보 상태 (API 스펙에 맞게)
  const [listingInfo, setListingInfo] = useState({
    lessorNm: '', // 임대인 이름
    propertyNm: '', // 매물 이름
    content: '', // 내용
    area: '', // 면적 (제곱미터)
    areaP: '', // 평수
    deposit: '', // 보증금
    mnRent: '', // 월세
    fee: '', // 관리비
    period: '', // 계약 기간 (개월)
    floor: '', // 층수
    facing: 'N', // 방향 (N, S, E, W)
    roomCnt: '', // 방 개수
    bathroomCnt: '', // 욕실 개수
    constructionDate: '', // 준공일
    parkingCnt: '', // 주차 대수
    hasElevator: false, // 엘리베이터 유무
    petAvailable: false, // 반려동물 가능 여부
    isAucPref: false, // 경매 선호 여부
    isBrkPref: false, // 중개 선호 여부
    aucAt: '', // 경매 날짜
    aucAvailable: '', // 경매 가능 시간
  })

  // 인증 버튼 활성화 조건
  const canVerify = addressCoords !== null && file !== null && !step1Completed

  // 인증 처리
  const handleVerify = () => {
    if (!canVerify) return
    setIsVerifying(true)
    // 실제로는 API 호출을 해야 하지만, 여기서는 시뮬레이션
    setTimeout(() => {
      setStep1Completed(true)
      setIsVerifying(false)
      setCurrentAccordion('item-2') // 2단계 자동 열기
    }, 1000)
  }

  // 주소 선택 핸들러
  const handleAddressSelect = (selectedAddress: string, coords: { lat: number; lng: number }) => {
    setAddress(selectedAddress)
    setAddressCoords(coords)
  }

  // 파일 변경 핸들러
  const handleFileChange = (newFile: File | null) => {
    setFile(newFile)
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
    const formData = {
      lessorNm: listingInfo.lessorNm,
      propertyNm: listingInfo.propertyNm,
      content: listingInfo.content,
      address: address,
      latitude: addressCoords?.lat || 0,
      longitude: addressCoords?.lng || 0,
      area: parseFloat(listingInfo.area) || 0,
      areaP: parseFloat(listingInfo.areaP) || 0,
      deposit: parseInt(listingInfo.deposit) || 0,
      mnRent: parseInt(listingInfo.mnRent) || 0,
      fee: parseInt(listingInfo.fee) || 0,
      images: [], // 이미지는 별도 업로드 필요
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
    }

    console.log('제출할 데이터:', formData)

    // TODO: 실제 API POST 요청
    // try {
    //   const response = await fetch('/api/listings', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(formData),
    //   })
    //   const data = await response.json()
    //   // 성공 처리
    // } catch (error) {
    //   // 에러 처리
    // }

    alert('매물 등록이 완료되었습니다!')
  }

  return (
    <>
      <div className="mx-auto w-full max-w-4xl px-4 py-8 pb-32">
        {/* 페이지 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">매물 등록</h1>
          <p className="mt-2 text-base text-gray-600">매물 정보를 입력하고 등록해주세요</p>
        </div>

        <Accordion
          type="single"
          collapsible
          className="w-full space-y-6"
          value={currentAccordion}
          onValueChange={value => {
            // 2, 3단계는 1단계 완료 후에만 열 수 있음
            if ((value === 'item-2' || value === 'item-3') && !step1Completed) {
              return
            }
            setCurrentAccordion(value)
          }}
        >
          <Step1PropertyVerification
            step1Completed={step1Completed}
            isVerifying={isVerifying}
            address={address}
            addressCoords={addressCoords}
            file={file}
            canVerify={canVerify}
            onAddressSelect={handleAddressSelect}
            onFileChange={handleFileChange}
            onVerify={handleVerify}
            refreshLocation={refreshLocation}
            isRefreshing={isRefreshing}
          />

          <Step2PropertyInfo
            step1Completed={step1Completed}
            listingInfo={listingInfo}
            canCompleteStep2={canCompleteStep2}
            onListingInfoChange={setListingInfo}
            onComplete={() => {
              setStep2Completed(true)
              setCurrentAccordion('')
            }}
          />

          <Step3AdditionalInfo step1Completed={step1Completed} />
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
