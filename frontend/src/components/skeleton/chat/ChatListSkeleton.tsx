import { Skeleton } from '@/components/ui/skeleton'

export default function ChatListSkeleton() {
  return (
    <div className="flex flex-col">
      {[...Array(8)].map((_, idx) => (
        <div key={idx} className="border-b border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="mt-2 h-4 w-full" />
              <div className="mt-1 flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

