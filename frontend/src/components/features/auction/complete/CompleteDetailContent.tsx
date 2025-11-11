'use client'

import { useRouter } from 'next/navigation'

import { CompleteDetail } from '@/components/features/auction'
import { generateListingDetail } from '@/data/ListingDetailDummy'

export default function CompleteDetailContent() {
  const router = useRouter()

  // TODO: React Query useSuspenseQuery로 교체
  const paymentData = generateListingDetail(1)
  const bidAmount = 50000
  const deposit = 20000000
  const monthlyRent = 500000

  // 현재 시간 포맷팅
  const now = new Date()
  const paymentDate = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

  // 입금 기한 (3일 후)
  const dueDateTime = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
  const dueDate = `${dueDateTime.getFullYear()}.${String(dueDateTime.getMonth() + 1).padStart(2, '0')}.${String(dueDateTime.getDate()).padStart(2, '0')} 23:59`

  const handleConfirm = () => {
    router.push('/mypage')
  }

  return (
    <CompleteDetail
      data={paymentData}
      bidAmount={bidAmount}
      deposit={deposit}
      monthlyRent={monthlyRent}
      paymentDate={paymentDate}
      bankName="국민은행"
      accountNumber="123-456-789012"
      accountHolder="(주)집온"
      dueDate={dueDate}
      onConfirm={handleConfirm}
    />
  )
}
