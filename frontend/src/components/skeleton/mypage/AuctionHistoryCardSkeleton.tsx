import { Skeleton } from '@/components/ui/skeleton'

export default function AuctionHistoryCardSkeleton() {
  return (
    <div className="flex w-full flex-col rounded-lg border border-gray-200 bg-white p-2.5 shadow-sm">
      <div className="flex flex-row items-center gap-2.5">
        {/* 이미지 자리 */}
        <div className="relative w-24 flex-shrink-0">
          <Skeleton className="h-24 w-24 rounded-md" />
        </div>

        {/* 텍스트 정보 */}
        <div className="flex flex-1 flex-col gap-0.5">
          {/* 뱃지들 */}
          <div className="mb-1 flex items-center gap-1">
            <Skeleton className="h-4 w-10 rounded-full" />
            <Skeleton className="h-4 w-12 rounded-full" />
            <Skeleton className="h-4 w-14 rounded-full" />
          </div>

          {/* 제목 */}
          <Skeleton className="h-4 w-full" />

          {/* 입찰가 */}
          <div className="mt-1 flex items-baseline gap-1">
            <Skeleton className="h-3 w-full" />
          </div>

          {/* 버튼 영역 */}
          <div className="mt-1.5 flex gap-1.5">
            <Skeleton className="h-6 flex-1 rounded" />
            <Skeleton className="h-6 flex-1 rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}
