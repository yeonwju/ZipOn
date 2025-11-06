import MyListingCardSkeleton from '@/components/features/mypage/skeleton/MyListingCardSkeleton'
import { Skeleton } from '@/components/ui/skeleton'

interface MyListingListSkeletonProps {
  className?: string
}

export default function MyListingListSkeleton({ className }: MyListingListSkeletonProps) {
  return (
    <div className={className}>
      {Array.from({ length: 2 }).map((_, index) => (
        <MyListingCardSkeleton key={index} />
      ))}
      <Skeleton className="h-10 w-full" />
    </div>
  )
}
