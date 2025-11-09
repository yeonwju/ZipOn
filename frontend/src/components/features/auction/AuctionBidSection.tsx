'use client'

import { useState } from 'react'

interface AuctionBidSectionProps {
  minimumBid: number
  onBid?: (amount: number) => void
}

export default function AuctionBidSection({ minimumBid, onBid }: AuctionBidSectionProps) {
  const [bidAmount, setBidAmount] = useState('')

  const handleBid = () => {
    if (!bidAmount) {
      alert('입찰 금액을 입력해주세요.')
      return
    }

    const amount = parseInt(bidAmount)
    if (amount < minimumBid) {
      alert(`최저 입찰가는 ${minimumBid.toLocaleString()}원입니다.`)
      return
    }

    if (onBid) {
      onBid(amount)
    } else {
      alert(`${amount.toLocaleString()}원으로 입찰 완료되었습니다.`)
    }
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
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
  )
}

