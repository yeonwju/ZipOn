import { Suspense } from 'react'

import ContractResultClient from '@/app/(sub-header)/contract/result/ContractResultClient'

export default function ContractResultPage() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <ContractResultClient />
      </Suspense>
    </div>
  )
}
