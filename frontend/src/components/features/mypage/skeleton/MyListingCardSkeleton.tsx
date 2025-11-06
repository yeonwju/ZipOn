import { Skeleton } from '@/components/ui/skeleton'

export default function MyListingCardSkeleton() {
  return (
    <div className="flex w-full flex-col rounded-md border border-gray-200 p-3 shadow-sm">
      <div className="flex flex-row items-start gap-3">
        {/* 이미지 자리 */}
        <div className="relative flex-1">
          <Skeleton className="h-[75px] w-[145px] rounded-md" />
          
          {/* 뱃지 영역 */}
          <div className="mt-2.5 flex flex-row items-start gap-1">
            <Skeleton className="h-5 w-12 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        </div>

        {/* 텍스트 정보 */}
        <div className="flex flex-1 flex-col gap-1">
          {/* 건물 타입 */}
          <Skeleton className="h-3 w-16" />
          {/* 주소 */}
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          {/* 상세주소 */}
          <Skeleton className="h-3 w-20" />

          {/* 가격 */}
          <div className="mt-2 flex flex-col gap-0.5">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-6 w-32" />
          </div>
        </div>
      </div>

      {/* 버튼 영역 */}
      <div className="mt-3 flex w-full justify-center gap-2">
        <Skeleton className="h-8 flex-1 rounded-md" />
        <Skeleton className="h-8 flex-1 rounded-md" />
      </div>
    </div>
  )
}

