'use client'

import BrokerList from './BrokerList'

interface Broker {
  id: number
  name: string
  profileImage: string
  dealCount: number
  introduction: string
  experience: string
  specialty: string
  responseTime: string
  rating: number
}

interface BrokerApplyPageProps {
  propertyAddress: string
  brokers: Broker[]
  onSelect?: (brokerId: number) => void
}

export default function BrokerApplyPage({
  propertyAddress,
  brokers,
  onSelect,
}: BrokerApplyPageProps) {
  return (
    <div className="flex min-h-screen flex-col bg-white px-5 py-6">
      {/* 헤더 */}
      <div className="mb-6">
        <p className="mt-2 text-sm text-gray-600">{propertyAddress}</p>
        <p className="mt-1 text-xs text-gray-500">
          신청한 중개인 {brokers.length}명 · 카드를 펼쳐 정보를 확인하고 중개인을 선택해주세요.
        </p>
      </div>

      {/* 중개인 목록 */}
      <BrokerList brokers={brokers} onSelect={onSelect} />
    </div>
  )
}
