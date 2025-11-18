import { Skeleton } from '@/components/ui/skeleton'

export default function AuctionListSkeleton() {
  return (
    <div>
      {[...Array(6)].map((_, idx) => (
        <div key={idx} className="flex h-[130px] w-full border-b border-gray-200 bg-white">
          {/* Left Image */}
          <div className="relative h-full w-[150px] flex-shrink-0">
            <Skeleton className="h-full w-full" />
          </div>

          {/* Right */}
          <div className="mt-1 flex flex-1 flex-col overflow-hidden px-4 py-1">
            {/* Title + Lessor */}
            <div className="flex flex-col gap-1 leading-tight">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>

            {/* 가격 리스트 */}
            <div className="mt-1.5 flex flex-col gap-[1px]">
              <div className="flex justify-between">
                <Skeleton className="h-3.5 w-12" />
                <Skeleton className="h-3.5 w-16" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-3.5 w-12" />
                <Skeleton className="h-3.5 w-16" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-3.5 w-12" />
                <Skeleton className="h-3.5 w-16" />
              </div>
            </div>

            {/* 면적 */}
            <Skeleton className="mt-auto h-3 w-20" />
          </div>
        </div>
      ))}
    </div>
  )
}

