import AuctionHistoryCardSkeleton from '@/components/skeleton/mypage/AuctionHistoryCardSkeleton'
import { Skeleton } from '@/components/ui/skeleton'
interface AuctionHistoryListSkeletonProps {
  className?: string
}

export default function AuctionHistoryListSkeleton({ className }: AuctionHistoryListSkeletonProps) {
  return (
    <div className={className}>
      {Array.from({ length: 2 }).map((_, index) => (
        <AuctionHistoryCardSkeleton key={index} />
      ))}
      <Skeleton className="h-10 w-full" />
    </div>
  )
}
