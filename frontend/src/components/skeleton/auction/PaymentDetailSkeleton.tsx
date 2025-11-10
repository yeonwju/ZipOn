import { Skeleton } from '@/components/ui/skeleton'

export default function PaymentDetailSkeleton() {
  return (
    <div className="flex flex-col bg-gray-50 px-5 pt-2">
      <div className="rounded-3xl border-1 border-gray-200 bg-white px-5 py-6 shadow-md">
        {/* 헤더 */}
        <Skeleton className="mb-2 h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />

        {/* 중개인 프로필 */}
        <div className="mt-4 flex items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-5 w-20" />
        </div>

        {/* 결제 정보 & 결제 수단 */}
        <section className="mt-4 flex flex-col gap-4">
          {/* 결제 정보 */}
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
              <div className="flex justify-between py-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex justify-between py-3">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-32" />
              </div>
            </div>
          </div>

          {/* 결제 수단 */}
          <div className="rounded-2xl border-1 border-gray-300 bg-gray-50 p-4 shadow-md">
            <Skeleton className="mb-3 h-5 w-20" />
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="mt-4 h-12 w-full rounded-full" />
          </div>
        </section>
      </div>
    </div>
  )
}
