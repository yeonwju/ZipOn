'use client'

import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'

import { BrokerApplicationDetail } from '@/components/features/listings/brokers'
import { useAlertDialog } from '@/components/ui/alert-dialog'
import { generateListingDetail } from '@/data/ListingDetailDummy'

export default function BrokerApplicationContent() {
  const router = useRouter()
  const params = useParams()
  const { showSuccess, AlertDialog } = useAlertDialog()

  // TODO: React Query useSuspenseQuery로 교체
  const listing = generateListingDetail(Number(params.id))

  const handleSubmit = (data: { date: string; time: string; introduction: string }) => {
    // TODO: 실제 신청 API 호출
    console.log('방송 신청 데이터:', data)

    showSuccess('중개 신청이 완료되었습니다!', () => {
      router.replace('/mypage')
    })
  }

  return (
    <>
      <BrokerApplicationDetail
        listing={listing}
        ownerName="김철수"
        ownerImage="/profile.svg"
        preferredTime="평일 오후 2시~6시"
        ownerDescription="깔끔하고 조용한 분을 선호합니다. 방송 시 매물의 장점을 잘 부각시켜 주시면 감사하겠습니다."
        onSubmit={handleSubmit}
      />
      <AlertDialog />
    </>
  )
}

