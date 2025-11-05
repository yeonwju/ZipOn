'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import { mockAuctionHistories } from '@/data/AuctionHistory'
import type { AuctionHistory } from '@/types/api/mypage/auctionHistory'

import AuctionHistoryListSkeleton from '../skeleton/AuctionHistoryListSkeleton'
import AuctionHistoryCard from './AuctionHistoryCard'

interface AuctionHistoryListProps {
  className?: string
}

const INITIAL_DISPLAY_COUNT = 3

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

        // 시뮬레이션 딜레이 (3초)
        await new Promise(resolve => setTimeout(resolve, 3000))
        setAuctionHistory(mockAuctionHistories)
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
          href="" // TODO: 더보기 페이지 경로 입력
          className="mt-4 w-full rounded-md border border-gray-300 bg-white py-3 text-center text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          더보기
        </Link>
      )}
    </div>
  )
}
