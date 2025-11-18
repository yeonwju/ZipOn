'use client'

import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useState } from 'react'

import { useAlertDialog } from '@/components/ui/alert-dialog'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useSelectBroker } from '@/queries/useBroker'
import { BrokerInfo } from '@/types/api/broker'

interface BrokerCardProps {
  broker: BrokerInfo
  onSelect?: (brokerId: number) => void
}

export default function BrokerCard({ broker, onSelect }: BrokerCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const params = useParams()
  const propertySeq = Number(params.id)
  const { showSuccess, showError, AlertDialog } = useAlertDialog()

  const selectBrokerMutation = useSelectBroker(broker.auctionSeq, propertySeq)

  const handleSubmit = () => {
    selectBrokerMutation.mutate(undefined, {
      onSuccess: result => {
        showSuccess(result?.message || `${broker.brkNm} 중개인을 선택하셨습니다!`, () => {
          onSelect?.(broker.brkUserSeq)
        })
      },
      onError: error => {
        showError(
          error instanceof Error ? error.message : '중개인 선택에 실패했습니다. 다시 시도해주세요.'
        )
      },
    })
  }

  return (
    <div className="rounded-2xl border border-gray-300 bg-gray-50 p-4 shadow-sm">
      {/* 기본 정보 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={broker.brkProfileImg || '/default-profile.svg'} alt={broker.brkNm} />
          </Avatar>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">{broker.brkNm}</span>
            </div>
            <span className="text-xs text-gray-500">거래성사 {broker.mediateCnt}회</span>
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
            <p className="text-sm text-gray-700">{broker.intro}</p>
          </div>

          {/* 라이브 일정 */}
          <div>
            <h4 className="mb-2 text-sm font-semibold text-gray-900">라이브 방송 가능 일정</h4>
            <p className="text-sm text-gray-700">
              {broker.strmDate} {broker.strmStartTm} ~ {broker.strmEndTm}
            </p>
          </div>

          {/* 선택 버튼 */}
          <Button
            onClick={handleSubmit}
            disabled={selectBrokerMutation.isPending}
            className="mt-4 w-full rounded-full bg-blue-400 py-6 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {selectBrokerMutation.isPending ? '선택 중...' : `${broker.brkNm} 중개인 선택`}
          </Button>
        </div>
      )}
      <AlertDialog />
    </div>
  )
}
