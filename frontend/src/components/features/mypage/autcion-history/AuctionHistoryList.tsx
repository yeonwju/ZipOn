import Link from 'next/link'

import { mockAuctionHistories } from '@/data/AuctionHistory'

import AuctionHistoryCard from './AuctionHistoryCard'

interface AuctionHistoryListProps {
  className?: string
}

const INITIAL_DISPLAY_COUNT = 3

export default async function AuctionHistoryList({ className }: AuctionHistoryListProps) {
  // 👇 fetch 대기 시뮬레이션 (3초 딜레이)
  await new Promise(resolve => setTimeout(resolve, 3000))

  // 실제 API fetch로 교체될 부분
  const auctionHistory = mockAuctionHistories

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
          className="mt-4 w-full rounded-md border border-gray-300 bg-white py-3 text-center text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          더보기
        </Link>
      )}
    </div>
  )
}
