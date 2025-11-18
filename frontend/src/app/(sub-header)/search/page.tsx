import { Suspense } from 'react'

import SearchPageClient from '@/app/(sub-header)/search/SearchPageClient'

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchPageClient />
    </Suspense>
  )
}
