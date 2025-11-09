import { Skeleton } from '@/components/ui/skeleton'

export default function VerifyFormSkeleton() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 px-5 py-6">
      <div className="rounded-3xl border border-gray-200 bg-white px-5 py-6 shadow-md">
        {/* 제목 */}
        <Skeleton className="mb-6 h-8 w-48" />

        {/* 폼 필드들 */}
        <div className="flex flex-col gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
          ))}

          {/* 인증 버튼 */}
          <Skeleton className="mt-4 h-12 w-full rounded-full" />
        </div>
      </div>
    </div>
  )
}

