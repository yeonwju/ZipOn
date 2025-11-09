import { Skeleton } from '@/components/ui/skeleton'

export default function LiveCreateSkeleton() {
  return (
    <>
      <section className="flex min-h-screen flex-col bg-gray-200 pb-32">
        <div className="mx-auto w-full max-w-2xl space-y-2 bg-white">
          {/* 제목 입력 */}
          <div className="p-4">
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>

          {/* 주소 검색 */}
          <div className="px-4 py-2">
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>

          {/* 매물 선택 */}
          <div className="border-y border-gray-200 p-4">
            <Skeleton className="mb-2 h-5 w-32" />
            <Skeleton className="mb-1 h-4 w-24" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>

          {/* 지도 미리보기 */}
          <Skeleton className="h-48 w-full" />
        </div>
      </section>

      {/* 하단 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white p-4">
        <Skeleton className="h-14 w-full rounded-full" />
      </div>
    </>
  )
}

