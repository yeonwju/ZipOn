'use client'

import { SearchX } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { ROUTES } from '@/constants'
import { mockAuctionHistories } from '@/data/AuctionHistoryDummy'
import { AuctionHistory } from '@/types/models/auction'

import AuctionHistoryListSkeleton from '../skeleton/AuctionHistoryListSkeleton'
import AuctionHistoryCard from './AuctionHistoryCard'

interface AuctionHistoryListProps {
  className?: string
}

const INITIAL_DISPLAY_COUNT = 2

/**
 * 경매 내역 리스트
 *
 * 향후 실제 API 연동 시 fetchAuctionHistory 함수만 수정하면 됩니다.
 */
export default function AuctionHistoryList({ className }: AuctionHistoryListProps) {
  const [auctionHistory, setAuctionHistory] = useState<AuctionHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 실제 API 호출 시뮬레이션
    const fetchAuctionHistory = async () => {
      try {
        setIsLoading(true)

        // 👇 실제 API 호출로 교체될 부분
        // const response = await fetch('/api/auction/history', { credentials: 'include' })
        // const data = await response.json()
        // setAuctionHistory(data.data)

        // 시뮬레이션 딜레이
        await new Promise(resolve => setTimeout(resolve, 2000))

        // 💡 테스트: Empty State 확인용 (데이터 있는 상태로 되돌리려면 아래 두 줄 바꾸기)
        // setAuctionHistory([]) // ← Empty State 테스트
        setAuctionHistory(mockAuctionHistories) // ← 정상 데이터
      } catch (error) {
        console.error('Failed to fetch auction history:', error)
        setAuctionHistory([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchAuctionHistory()
  }, [])

  // 로딩 중일 때 스켈레톤 표시
  if (isLoading) {
    return <AuctionHistoryListSkeleton className={className} />
  }

  // 데이터가 없거나 null일 때
  if (!auctionHistory || auctionHistory.length === 0) {
    return (
      <div className={className}>
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-16 text-center">
          <SearchX size={40} className="text-gray-400" />
          <p className="text-sm text-gray-500">경매 참여 내역이 없습니다.</p>
        </div>
      </div>
    )
  }

  const displayedItems = auctionHistory.slice(0, INITIAL_DISPLAY_COUNT)
  const hasMore = auctionHistory.length > INITIAL_DISPLAY_COUNT

  return (
    <div className="flex flex-col">
      <div className={className}>
        {displayedItems.map(auction => (
          <AuctionHistoryCard key={auction.id} auctionHistory={auction} />
        ))}
      </div>

      {hasMore && (
        <Link
          href={ROUTES.MY_AUCTIONS_HISTORY}
          className="mt-2 w-full rounded-md border-1 border-gray-300 bg-white py-3 text-center text-sm font-medium text-gray-700 shadow-md transition-colors hover:bg-gray-50"
        >
          더보기
        </Link>
      )}
    </div>
  )
}
