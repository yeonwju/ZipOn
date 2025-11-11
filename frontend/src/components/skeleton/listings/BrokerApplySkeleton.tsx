import { Skeleton } from '@/components/ui/skeleton'

export default function BrokerApplySkeleton() {
  return (
    <div className="flex min-h-screen flex-col bg-white px-5 py-6">
      {/* 헤더 */}
      <div className="mb-6">
        <Skeleton className="mb-2 h-6 w-48" />
        <Skeleton className="mb-1 h-4 w-64" />
        <Skeleton className="h-3 w-56" />
      </div>

      {/* 중개인 카드 목록 */}
      <div className="flex flex-col gap-4">
        {[...Array(3)].map((_, idx) => (
          <div key={idx} className="rounded-2xl border-2 border-gray-300 bg-gray-50 p-4 shadow-lg">
            {/* 기본 정보 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
