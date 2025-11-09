'use client'

import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'

import { useAlertDialog } from '@/components/ui/alert-dialog'

interface AuctionBidSectionProps {
  minimumBid: number
  onBid?: (amount: number) => void
  className?: string
}

export default function AuctionBidSection({
  minimumBid,
  onBid,
  className,
}: AuctionBidSectionProps) {
  const [bidAmount, setBidAmount] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { showError, showConfirm, AlertDialog } = useAlertDialog()

  const handleBid = () => {
    if (!bidAmount) {
      showError('입찰 금액을 입력해주세요.', () => {
        inputRef.current?.focus()
      })
      return
    }

    const amount = parseInt(bidAmount)
    if (amount < minimumBid) {
      showError(`최저 입찰가는 ${minimumBid.toLocaleString()}원입니다.`, () => {
        inputRef.current?.focus()
      })
      return
    }

    showConfirm(
      `${amount.toLocaleString()}원을 결제하시겠습니까?`,
      () => {
        if (onBid) {
          onBid(amount)
        }
        router.push(`/auction/payment/1`)
      },
      undefined,
      { confirmText: '결제하기', cancelText: '취소' }
    )
  }

  return (
    <>
      <div className={className || 'rounded-2xl border border-gray-100 bg-gray-50 p-4'}>
        <h3 className="mb-3 text-base font-semibold text-gray-900">입찰하기</h3>
        <div className="flex flex-col divide-y divide-gray-200">
          <div className="flex justify-between py-2 text-sm">
            <span className="text-gray-500">최저 입찰가</span>
            <span className="font-medium text-gray-900">{minimumBid.toLocaleString()}원</span>
          </div>

          <div className="flex flex-col gap-2 py-3">
            <label htmlFor="bid" className="text-sm text-gray-500">
              입찰금액
            </label>
            <input
              ref={inputRef}
              id="bid"
              type="number"
              placeholder="입찰금액을 입력해주세요"
              value={bidAmount}
              onChange={e => setBidAmount(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-right text-gray-900 transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <button
          onClick={handleBid}
          className="mt-4 w-full rounded-full bg-blue-500 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-600 active:bg-blue-700"
        >
          입찰하기
        </button>
      </div>

      <AlertDialog />
    </>
  )
}
