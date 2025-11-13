import { BrokerInfo } from '@/types/api/broker'

import BrokerCard from './BrokerCard'

interface BrokerListProps {
  brokers: BrokerInfo[]
  onSelect?: (brokerId: number) => void
}

export default function BrokerList({ brokers, onSelect }: BrokerListProps) {
  if (brokers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-gray-500">아직 신청한 중개인이 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {brokers.map(broker => (
        <BrokerCard key={broker.auctionSeq} broker={broker} onSelect={onSelect} />
      ))}
    </div>
  )
}

