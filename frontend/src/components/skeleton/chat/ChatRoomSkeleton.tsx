import { Skeleton } from '@/components/ui/skeleton'

export default function ChatRoomSkeleton() {
  return (
    <div className="flex h-screen flex-col bg-white">
      {/* 헤더 */}
      <div className="flex items-center gap-3 border-b border-gray-200 p-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-5 w-32" />
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {/* 상대방 메시지 */}
        <div className="flex items-start gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-12 w-48 rounded-2xl" />
        </div>

        {/* 내 메시지 */}
        <div className="flex items-start justify-end gap-2">
          <Skeleton className="h-12 w-40 rounded-2xl" />
        </div>

        {/* 상대방 메시지 */}
        <div className="flex items-start gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-16 w-56 rounded-2xl" />
        </div>

        {/* 내 메시지 */}
        <div className="flex items-start justify-end gap-2">
          <Skeleton className="h-12 w-44 rounded-2xl" />
        </div>
      </div>

      {/* 입력 영역 */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <Skeleton className="h-12 flex-1 rounded-full" />
          <Skeleton className="h-12 w-12 rounded-full" />
        </div>
      </div>
    </div>
  )
}

