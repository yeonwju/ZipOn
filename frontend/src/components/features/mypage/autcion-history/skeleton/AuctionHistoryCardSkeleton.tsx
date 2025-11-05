import { Skeleton } from '@/components/ui/skeleton'

export default function AuctionHistoryCardSkeleton() {
  return (
    <div className="flex w-full flex-col rounded-md border border-gray-200 p-3 shadow-sm">
      {/* 상단 영역 */}
      <div className="flex flex-row items-start justify-between gap-2">
        {/* 텍스트 정보 */}
        <div className="flex flex-col gap-1">
          {/* 제목 */}
          <Skeleton className="h-6 w-48" />

          {/* 남은 시간 */}
          <Skeleton className="h-5 w-24" />

          {/* 진행 상태 */}
          <Skeleton className="h-5 w-20" />

          {/* 대기 순위 */}
          <Skeleton className="h-5 w-28" />
        </div>

        {/* 이미지 자리 */}
        <Skeleton className="h-[80px] w-[200px] rounded-md" />
      </div>

      {/* 입찰가 */}
      <div className="mt-2">
        <Skeleton className="h-5 w-40" />
      </div>

      {/* 버튼 영역 */}
      <div className="mt-3 flex w-full justify-center gap-2">
        <Skeleton className="h-8 flex-1 rounded-md" />
        <Skeleton className="h-8 flex-1 rounded-md" />
      </div>
    </div>
  )
}
