import AuctionHistoryCardSkeleton from '@/components/features/mypage/skeleton/AuctionHistoryCardSkeleton'
import { Skeleton } from '@/components/ui/skeleton'
interface AuctionHistoryListSkeletonProps {
  className?: string
}

export default function AuctionHistoryListSkeleton({ className }: AuctionHistoryListSkeletonProps) {
  return (
    <div className={className}>
      {Array.from({ length: 3 }).map((_, index) => (
        <AuctionHistoryCardSkeleton key={index} />
      ))}
      <Skeleton className="h-10 w-full" />
    </div>
  )
}
