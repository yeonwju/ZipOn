'use client'

import { BrokerInfo } from '@/types/api/broker'

import BrokerList from './BrokerList'

interface BrokerApplyPageProps {
  propertyAddress: string
  brokers: BrokerInfo[]
  onSelect?: (brokerId: number) => void
}

export default function BrokerApplyPage({
  propertyAddress,
  brokers,
  onSelect,
}: BrokerApplyPageProps) {
  return (
    <div className="flex min-h-screen flex-col bg-white px-5 pb-6">
      {/* 헤더 */}
      <div className="mb-6">
        <p className="text-md mt-2 font-medium text-gray-600">{propertyAddress}</p>
        <p className="mt-1 text-xs text-gray-500">
          신청한 중개인 {brokers.length}명 · 카드를 펼쳐 정보를 확인하고 중개인을 선택해주세요.
        </p>
      </div>

      {/* 중개인 목록 */}
      <BrokerList brokers={brokers} onSelect={onSelect} />
    </div>
  )
}
