'use client'

import { useParams, useRouter, useSearchParams } from 'next/navigation'

import { CompleteDetail } from '@/components/features/auction'
import { useAlertDialog } from '@/components/ui/alert-dialog'
import { useBidAmount } from '@/queries/useBid'
import { useContractPayment } from '@/queries/useContract'
import { useSearchListingDetail } from '@/queries/useListing'

export default function CompleteDetailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const propertySeq = searchParams.get('propertySeq')
  const contractSeq = searchParams.get('contractSeq')
  const accountNumber = searchParams.get('account')
  const { id: auctionSeq } = useParams()

  const { showSuccess, showError, AlertDialog } = useAlertDialog()

  const { data: bidAmount } = useBidAmount(Number(auctionSeq))
  const { isSuccess } = useContractPayment(Number(contractSeq))

  const { data: paymentData } = useSearchListingDetail(Number(propertySeq))

  const handleConfirm = () => {
    if (isSuccess) {
      showSuccess('입금이 완료되었습니다.')
      router.push('/mypage')
    } else {
      showError('입금이 실패하였습니다.')
    }
  }

  return (
    <>
      {bidAmount && accountNumber && paymentData ? (
        <CompleteDetail
          data={paymentData}
          bidAmount={bidAmount}
          accountNumber={accountNumber}
          accountHolder="(주)집온"
          onConfirm={handleConfirm}
        />
      ) : (
        <div className="flex flex-col items-center justify-center bg-white px-5 py-16">
          <div className="rounded-3xl border border-gray-200 bg-white px-8 py-12 shadow-sm">
            <div className="flex flex-col items-center gap-4">
              {/* 아이콘 영역 */}
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                <svg
                  className="h-10 w-10 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                  />
                </svg>
              </div>

              {/* 메시지 영역 */}
              <div className="flex flex-col items-center gap-2 text-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  결제 완료 정보를 불러올 수 없습니다
                </h3>
                <p className="max-w-sm text-sm text-gray-500">
                  입찰 정보 또는 계좌 정보를 찾을 수 없습니다.
                  <br />
                  다시 시도해주세요.
                </p>
              </div>

              {/* 액션 버튼 */}
              <button
                onClick={() => router.back()}
                className="mt-2 rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                이전 페이지로
              </button>
            </div>
          </div>
        </div>
      )}

      <AlertDialog />
    </>
  )
}
