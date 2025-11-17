'use client'

import { SearchX } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { ROUTES } from '@/constants'
import { myAuctionInfo } from '@/services/mypageService'
import { MyAuctionsData } from '@/types/api/mypage'

import AuctionHistoryListSkeleton from '../../../skeleton/mypage/AuctionHistoryListSkeleton'
import AuctionHistoryCard from './AuctionHistoryCard'

interface AuctionHistoryListProps {
  className?: string
}

const INITIAL_DISPLAY_COUNT = 2

/**
 * 경매 내역 리스트
 */
export default function AuctionHistoryList({ className }: AuctionHistoryListProps) {
  const [auctionHistory, setAuctionHistory] = useState<MyAuctionsData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAuctionHistory = async () => {
      try {
        setIsLoading(true)

        const result = await myAuctionInfo()
        if (result.success && result.data) {
          setAuctionHistory(result.data)
        } else {
          setAuctionHistory([])
        }
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
          <AuctionHistoryCard key={`${auction.auctionSeq}-${auction.propertySeq}`} auctionData={auction} />
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
