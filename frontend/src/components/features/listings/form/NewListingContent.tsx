'use client'

import { CheckCircle2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

import {
  Step1PropertyVerification,
  Step2PropertyInfo,
  Step3AdditionalInfo,
} from '@/components/features/listings'
import { Accordion } from '@/components/ui/accordion'
import { useAlertDialog } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import useUserLocation from '@/hooks/map/useUserLocation'
import { useUser } from '@/hooks/queries'
import { useCreateListing } from '@/hooks/queries/useListing'
import { registerListingVerification } from '@/services/listingService'

export default function NewListingContent() {
  const { refresh: refreshLocation, isRefreshing } = useUserLocation()
  const router = useRouter()
  // 유저 정보
  const { data: user } = useUser()
  const { AlertDialog, showError } = useAlertDialog()

  // 매물 등록 Mutation
  const createListing = useCreateListing()

  // Step1 데이터
  const [addressCoords, setAddressCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [baseAddress, setBaseAddress] = useState<string>('')
  const [detailAddress, setDetailAddress] = useState<string>('')
  const [files, setFiles] = useState<File[]>([])

  // 단계별 완료 상태
  const [step1Completed, setStep1Completed] = useState(false)
  const [step2Completed, setStep2Completed] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [currentAccordion, setCurrentAccordion] = useState('item-1')

  // 백엔드 전달 해야할 정보
  const [pdfCode, setPdfCode] = useState<string | undefined>('')
  const [verificationStatus, setVerificationStatus] = useState<string | undefined>('')
  const [isCertificated, setIsCertificated] = useState<boolean | undefined>(false)
  const [riskScore, setRiskScore] = useState<number | undefined>(0)
  const [riskReason, setRiskReason] = useState<string | undefined>('')

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
    images: [] as File[],
  })

  // Step3 추가 정보 상태
  const [additionalInfo, setAdditionalInfo] = useState({
    constructionDate: '',
    parkingCnt: '',
    hasElevator: false,
    petAvailable: false,
    isAucPref: false,
    isBrkPref: false,
    aucAt: '',
    aucAvailable: '',
    notes: '',
  })

  // 인증 버튼 활성화 조건
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
  }

  const handleDetailAddressChange = (detail: string) => {
    setDetailAddress(detail)
  }

  const handleFileChange = (newFiles: File[]) => {
    setFiles(newFiles)
  }

  async function handleVerify() {
    try {
      setIsVerifying(true)
      const request = {
        file: files[0],
        regiNm: user?.name,
        regiBirth: user?.birth,
        address: `${baseAddress} ${detailAddress}`,
      }
      const result = await registerListingVerification(request)

      if (result.success) {
        console.log('인증 성공:', result)
        setPdfCode(result.data?.pdfCode)
        setVerificationStatus(result.data?.verificationStatus)
        setIsCertificated(result.data?.isCertificated)
        setRiskScore(result.data?.riskScore)
        setRiskReason(result.data?.riskReason)

        setIsVerifying(false)
        setStep1Completed(true)
        setCurrentAccordion('item-2')
      } else {
        showError(`등기부등본과 입력하신 정보가 일치하지 않습니다.`)
        setIsVerifying(false)
        console.warn('인증 실패:', result)
      }
    } catch (error) {
      console.error('인증 요청 중 오류 발생:', error)
    }
  }

  const handleListingInfoChange = (info: typeof listingInfo) => {
    setListingInfo(info)
  }

  const handleAdditionalInfoChange = (info: typeof additionalInfo) => {
    setAdditionalInfo(info)
  }

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

  const handleSubmit = async () => {
    try {
      const fullAddress = `${baseAddress} ${detailAddress}`.trim()

      // API 요청 데이터 준비
      const requestData = {
        req: JSON.stringify({
          lessorNm: listingInfo.lessorNm,
          address: fullAddress,
          propertyNm: listingInfo.propertyNm,
          latitude: addressCoords?.lat || 0,
          longitude: addressCoords?.lng || 0,
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
          constructionDate: additionalInfo.constructionDate,
          parkingCnt: parseInt(additionalInfo.parkingCnt) || 0,
          hasElevator: additionalInfo.hasElevator,
          petAvailable: additionalInfo.petAvailable,
          isAucPref: additionalInfo.isAucPref,
          isBrkPref: additionalInfo.isBrkPref,
          aucAt: additionalInfo.aucAt,
          aucAvailable: additionalInfo.aucAvailable,
          pdfCode: pdfCode,
          verificationStatus: verificationStatus,
          isCertificated: isCertificated,
          riskScore: riskScore,
          riskReason: riskReason,
        }),
        images: listingInfo.images, // File[] 객체 그대로 전달
      }

      console.log('매물 등록 요청 시작...')

      // React Query Mutation 실행
      const result = await createListing.mutateAsync(requestData)

      if (result.success) {
        console.log('✅ 매물 등록 성공!', result.data?.propertySeq)
        router.replace(`/listings/${result.data?.propertySeq}`)
      } else {
        console.error('❌ 매물 등록 실패:', result.message)
        showError(result.message || '매물 등록에 실패했습니다. 다시 시도해주세요.')
      }
    } catch (error) {
      console.error('매물 등록 중 예외 발생:', error)
      showError('매물 등록 중 오류가 발생했습니다. 다시 시도해주세요.')
    }
  }

  return (
    <>
      <div className="mx-auto w-full max-w-4xl pb-32">
        <Accordion
          type="single"
          collapsible
          className="w-full"
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
              disabled={createListing.isPending}
              size="lg"
              className="h-12 bg-blue-500 px-8 text-base font-bold text-white shadow-sm transition-all hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CheckCircle2 size={20} className="mr-2" />
              {createListing.isPending ? '등록 중...' : '매물 등록 완료'}
            </Button>
          </div>
        </div>
      )}
      <AlertDialog />
    </>
  )
}
