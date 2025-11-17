import { Skeleton } from '@/components/ui/skeleton'

export default function LiveListSkeleton() {
  return (
    <section className="pb-13.5">
      <div className="grid grid-cols-1 gap-4 p-4">
        {[...Array(6)].map((_, idx) => (
          <div key={idx} className="rounded-2xl border-2 border-gray-300 bg-white shadow-md">
            {/* 썸네일 */}
            <Skeleton className="h-40 w-full rounded-t-2xl" />

            {/* 정보 */}
            <div className="p-3">
              <Skeleton className="mb-2 h-5 w-full" />
              <div className="flex items-center justify-between gap-2">
                <div className={'flex flex-row gap-1'}>
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-10" />
                </div>
                <div className={'flex flex-row gap-2'}>
                  <Skeleton className={'h-4 w-12'} />
                  <Skeleton className={'h-4 w-12'} />
                  <Skeleton className={'h-4 w-12'} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
