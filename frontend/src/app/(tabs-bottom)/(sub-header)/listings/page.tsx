import { Suspense } from 'react'

import ListingsTabContent from '@/components/features/listings/tab/ListingsTabContent'
import { ListingsTabSkeleton } from '@/components/skeleton/listings'

export const dynamic = 'force-dynamic'

export default function ListingsPage() {
  return (
    <Suspense fallback={<ListingsTabSkeleton />}>
      <ListingsTabContent />
    </Suspense>
  )
}
