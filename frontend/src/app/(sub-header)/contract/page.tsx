import { Suspense } from 'react'
import ContractClient from '@/app/(sub-header)/contract/ContractClient'

export default function ContractPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ContractClient />
    </Suspense>
  )
}
