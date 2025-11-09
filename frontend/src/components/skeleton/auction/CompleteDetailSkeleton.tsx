import { Skeleton } from '@/components/ui/skeleton'

export default function CompleteDetailSkeleton() {
  return (
    <div className="flex flex-col bg-gray-50 px-5 pt-2 pb-4">
      <div className="rounded-3xl border border-gray-200 bg-white px-5 py-6 shadow-md">
        {/* 헤더: 완료 아이콘 & 메시지 */}
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <Skeleton className="h-16 w-16 rounded-full" />
          </div>
          <Skeleton className="mx-auto mb-2 h-6 w-48" />
          <Skeleton className="mx-auto mb-1 h-4 w-40" />
          <Skeleton className="mx-auto h-3 w-32" />
        </div>

        {/* 중개인 프로필 */}
        <div className="mt-6 flex items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-5 w-20" />
        </div>

        {/* 결제 내역 & 계좌 정보 */}
        <section className="mt-6 flex flex-col gap-4">
          {/* 결제 내역 */}
          <div className="rounded-2xl border-1 border-gray-300 bg-gray-50 p-4 shadow-md">
            <Skeleton className="mb-3 h-5 w-20" />
            <div className="flex flex-col divide-y divide-gray-200">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex justify-between py-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-28" />
                </div>
              ))}
            </div>
          </div>

          {/* 계좌 정보 */}
          <div className="rounded-2xl border-1 border-gray-300 bg-gray-50 p-4 shadow-md">
            <Skeleton className="mb-3 h-5 w-24" />
            <div className="space-y-3 rounded-lg border-1 border-gray-300 bg-white p-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
            <Skeleton className="mt-3 h-8 w-full" />
          </div>
        </section>

        {/* 확인 버튼 */}
        <Skeleton className="mt-6 h-12 w-full rounded-full" />
      </div>
    </div>
  )
}
