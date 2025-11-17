'use client'

import { useParams, useRouter } from 'next/navigation'

import { BrokerApplyPage } from '@/components/features/listings/brokers/apply'
import { BrokerApplySkeleton } from '@/components/skeleton/listings'
import { useAlertDialog } from '@/components/ui/alert-dialog'
import { generateListingDetail } from '@/data/ListingDetailDummy'
import { useRequestBrokerList } from '@/hooks/queries/useBroker'

export default function BrokerApplyContent() {
  const router = useRouter()
  const { showSuccess, showError, AlertDialog } = useAlertDialog()
  const params = useParams()
  const propertySeq = Number(params.id)
  const { data: response, isLoading, isError } = useRequestBrokerList(propertySeq)
  const listing = generateListingDetail(Number(params.id))
  // 로딩 중
  if (isLoading) {
    return <BrokerApplySkeleton />
  }

  // 에러 또는 데이터 없음
  if (isError || !response?.success) {
    const errorMessage =
      response && !response.success ? response.message : '중개인 목록을 불러올 수 없습니다.'
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-red-500">{errorMessage || '중개인 목록을 불러올 수 없습니다.'}</p>
      </div>
    )
  }

  const brokers = response.data

  const handleSelect = (brokerId: number) => {
    const selectedBroker = brokers.find(b => b.brkUserSeq === brokerId)
    if (selectedBroker) {
      showSuccess(`${selectedBroker.brkNm} 중개인을 선택하셨습니다!`, () => {
        // TODO: 실제 선택 API 호출
        console.log('중개인 선택:', brokerId)
        router.replace('/mypage')
      })
    }
  }

  return (
    <>
      <BrokerApplyPage
        propertyAddress={listing.address}
        brokers={brokers}
        onSelect={handleSelect}
      />
      <AlertDialog />
    </>
  )
}
