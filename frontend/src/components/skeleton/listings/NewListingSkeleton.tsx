import { Skeleton } from '@/components/ui/skeleton'

export default function NewListingSkeleton() {
  return (
    <div className="mx-auto w-full max-w-4xl pb-32">
      {/* 아코디언 형태의 스텝들 */}
      <div className="flex flex-col gap-4">
        {/* Step 1 */}
        <div className="rounded-2xl border-2 border-gray-300 bg-white p-6 shadow-md">
          <Skeleton className="mb-4 h-6 w-40" />
          <div className="flex flex-col gap-4">
            <div>
              <Skeleton className="mb-2 h-4 w-24" />
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
            <div>
              <Skeleton className="mb-2 h-4 w-24" />
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-full" />
          </div>
        </div>

        {/* Step 2 */}
        <div className="rounded-2xl border-2 border-gray-300 bg-gray-50 p-6 shadow-sm">
          <Skeleton className="h-6 w-40" />
        </div>

        {/* Step 3 */}
        <div className="rounded-2xl border-2 border-gray-300 bg-gray-50 p-6 shadow-sm">
          <Skeleton className="h-6 w-40" />
        </div>
      </div>
    </div>
  )
}

