import { Skeleton } from '@/components/ui/skeleton'

export default function CalendarSkeleton() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-4">
      {/* 캘린더 스켈레톤 */}
      <div className="w-full max-w-[360px] rounded-2xl border-2 border-gray-300 bg-white p-4 shadow-md">
        {/* 월 선택 헤더 */}
        <div className="mb-4 flex items-center justify-between">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>

        {/* 요일 행 */}
        <div className="mb-2 grid grid-cols-7 gap-2">
          {[...Array(7)].map((_, i) => (
            <Skeleton key={i} className="h-6 w-full" />
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div className="grid grid-cols-7 gap-2">
          {[...Array(35)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-md" />
          ))}
        </div>
      </div>

      {/* 선택된 날짜 정보 */}
      <div className="w-full max-w-[320px]">
        <Skeleton className="mb-2 h-5 w-40" />
        <Skeleton className="h-16 w-full rounded-md" />
      </div>
    </div>
  )
}

