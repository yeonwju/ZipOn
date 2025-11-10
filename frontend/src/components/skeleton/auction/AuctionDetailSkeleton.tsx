import { Skeleton } from '@/components/ui/skeleton'

export default function AuctionDetailSkeleton() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* 이미지 갤러리 스켈레톤 */}
      <Skeleton className="h-64 w-full rounded-none" />

      {/* 상세 내용 */}
      <div className="relative z-10 -mt-2 rounded-t-3xl bg-white px-5 py-6 shadow-md">
        {/* 헤더: 주소 */}
        <Skeleton className="mb-2 h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />

        {/* 프로필 & 타이머 */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-5 w-20" />
          </div>
          <div className="text-right">
            <Skeleton className="mb-1 h-3 w-20" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>

        {/* 상세정보 + 입찰 */}
        <section className="mt-4 flex flex-col gap-6">
          {/* 상세정보 */}
          <div className="rounded-2xl border-1 border-gray-300 bg-gray-50 p-4 shadow-md">
            <Skeleton className="mb-3 h-5 w-20" />
            <div className="flex flex-col divide-y divide-gray-200">
              <div className="flex justify-between py-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-28" />
              </div>
              <div className="flex justify-between py-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>

          {/* 입찰하기 */}
          <div className="rounded-2xl border-1 border-gray-300 bg-gray-50 p-4 shadow-md">
            <Skeleton className="mb-3 h-5 w-20" />
            <div className="flex flex-col divide-y divide-gray-200">
              <div className="flex justify-between py-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex flex-col gap-2 py-3">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            </div>
            <Skeleton className="mt-4 h-12 w-full rounded-full" />
          </div>
        </section>
      </div>
    </div>
  )
}
