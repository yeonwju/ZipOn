'use client'

import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react'
import { useState } from 'react'

import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

interface BrokerCardProps {
  broker: {
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
  onSelect?: (brokerId: number) => void
}

export default function BrokerCard({ broker, onSelect }: BrokerCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="rounded-2xl border border-gray-300 bg-gray-50 p-4 shadow-sm">
      {/* 기본 정보 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={broker.profileImage} alt={broker.name} />
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold text-gray-900">{broker.name}</span>
            <span className="text-xs text-gray-500">거래성사 {broker.dealCount}회</span>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="rounded-full p-2 transition-colors hover:bg-gray-100"
        >
          {isExpanded ? (
            <ChevronUpIcon className="h-5 w-5 text-gray-600" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* 펼쳐진 상세 정보 */}
      {isExpanded && (
        <div className="mt-4 space-y-3 border-t border-gray-100 pt-4">
          {/* 자기소개 */}
          <div>
            <h4 className="mb-2 text-sm font-semibold text-gray-900">자기소개</h4>
            <p className="text-sm text-gray-700">{broker.introduction}</p>
          </div>

          {/* 경력 */}
          <div>
            <h4 className="mb-2 text-sm font-semibold text-gray-900">경력</h4>
            <p className="text-sm text-gray-700">{broker.experience}</p>
          </div>

          {/* 전문 분야 */}
          <div>
            <h4 className="mb-2 text-sm font-semibold text-gray-900">전문 분야</h4>
            <p className="text-sm text-gray-700">{broker.specialty}</p>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-semibold text-gray-900">라이브 시간</h4>
            <p className="text-sm text-gray-700">14:00 ~ 15:00</p>
          </div>

          {/* 응답 시간 */}
          <div className="rounded-lg border border-blue-100 bg-blue-50 p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">평균 응답 시간</span>
              <span className="font-semibold text-blue-600">{broker.responseTime}</span>
            </div>
          </div>

          {/* 선택 버튼 */}
          <Button
            onClick={() => onSelect?.(broker.id)}
            className="mt-4 w-full rounded-full bg-blue-400 py-6 text-sm font-semibold text-white"
          >
            {broker.name} 중개인 선택
          </Button>
        </div>
      )}
    </div>
  )
}
