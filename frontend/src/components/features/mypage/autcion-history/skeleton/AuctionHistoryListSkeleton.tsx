import AuctionHistoryCardSkeleton from '@/components/features/mypage/autcion-history/skeleton/AuctionHistoryCardSkeleton'

interface AuctionHistoryListSkeletonProps {
  className?: string
}

export default function AuctionHistoryListSkeleton({ className }: AuctionHistoryListSkeletonProps) {
  return (
    <div className={className}>
      {Array.from({ length: 3 }).map((_, index) => (
        <AuctionHistoryCardSkeleton key={index} />
      ))}
    </div>
  )
}
