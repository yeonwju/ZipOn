import { mockAuctionHistories } from '@/data/AuctionHistory'
import type { AuctionHistory } from '@/types/api/mypage/auctionHistory'

import AuctionHistoryCard from './AuctionHistoryCard'

interface AuctionHistoryListProps {
  auctionHistory?: AuctionHistory[] // 임시 props (실제 fetch 전까지)
  className?: string
}

export default async function AuctionHistoryList({ className }: AuctionHistoryListProps) {
  // 👇 fetch 대기 시뮬레이션 (3초 딜레이)
  await new Promise(resolve => setTimeout(resolve, 3000))

  // 실제 API fetch로 교체될 부분
  const auctionHistory = mockAuctionHistories

  return (
    <div className={className}>
      {auctionHistory.map(auction => (
        <AuctionHistoryCard key={auction.id} auctionHistory={auction} />
      ))}
    </div>
  )
}
