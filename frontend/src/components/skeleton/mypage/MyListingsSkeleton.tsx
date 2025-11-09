import { Skeleton } from '@/components/ui/skeleton'

export default function MyListingsSkeleton() {
  return (
    <section>
      {/* 탭 헤더 */}
      <div className="flex gap-2 border-b border-gray-200 px-4">
        {[...Array(2)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-28" />
        ))}
      </div>

      {/* 매물 리스트 */}
      <div className="p-4">
        <div className="flex flex-col gap-4">
          {[...Array(5)].map((_, idx) => (
            <div
              key={idx}
              className="rounded-2xl border-2 border-gray-300 bg-white p-4 shadow-sm"
            >
              <div className="flex gap-3">
                <Skeleton className="h-24 w-24 rounded-lg" />
                <div className="flex flex-1 flex-col gap-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


