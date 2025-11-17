import { Skeleton } from '@/components/ui/skeleton'

export default function BrokerApplicationSkeleton() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* 이미지 갤러리 */}
      <Skeleton className="h-64 w-full rounded-none" />

      {/* 상세 내용 */}
      <div className="relative z-10 -mt-2 rounded-t-3xl border-1 border-gray-200 bg-white px-5 py-6 shadow-md">
        {/* 헤더 */}
        <Skeleton className="mb-2 h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />

        {/* 섹션들 */}
        <section className="mt-4 flex flex-col gap-4">
          {/* 매물 정보 */}
          <div className="rounded-2xl border-1 border-gray-300 bg-gray-50 p-4 shadow-md">
            <Skeleton className="mb-3 h-5 w-20" />
            <div className="flex flex-col divide-y divide-gray-200">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex justify-between py-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-28" />
                </div>
              ))}
            </div>
          </div>

          {/* 집주인 정보 */}
          <div className="rounded-2xl border-1 border-gray-300 bg-gray-50 p-4 shadow-md">
            <Skeleton className="mb-3 h-5 w-24" />
            <div className="mb-4 flex items-center gap-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-5 w-20" />
            </div>
            <Skeleton className="mb-3 h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
          </div>

          {/* 신청 폼 */}
          <div className="rounded-2xl border-1 border-gray-300 bg-gray-50 p-4 shadow-md">
            <Skeleton className="mb-3 h-5 w-20" />
            <div className="flex flex-col gap-4">
              <div>
                <Skeleton className="mb-2 h-4 w-20" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
              <div>
                <Skeleton className="mb-2 h-4 w-20" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
              <div>
                <Skeleton className="mb-2 h-4 w-20" />
                <Skeleton className="h-24 w-full rounded-lg" />
                <Skeleton className="mt-1 h-3 w-16" />
              </div>
              <Skeleton className="mt-2 h-12 w-full rounded-full" />
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
