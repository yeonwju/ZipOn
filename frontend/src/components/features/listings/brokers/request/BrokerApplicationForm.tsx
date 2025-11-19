'use client'

import { CalendarIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import { useState } from 'react'

import { useAlertDialog } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { useRequestBroker } from '@/queries/useBroker'

interface BrokerApplicationFormProps {
  className?: string
}

const generateTimeOptions = () => {
  return Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0')
    return {
      value: `${hour}:00:00`,
      label: `${i}시`,
    }
  })
}

const addOneHour = (time: string): string => {
  const [hour] = time.split(':')
  const nextHour = (parseInt(hour) + 1) % 24
  return `${nextHour.toString().padStart(2, '0')}:00:00`
}

export default function BrokerApplicationForm({ className }: BrokerApplicationFormProps) {
  const [strmDate, setStrmDate] = useState<Date | undefined>(undefined)
  const [strmStartTm, setStrmStartTm] = useState('')
  const [strmEndTm, setStrmEndTm] = useState('')
  const [auctionEndAt, setAuctionEndAt] = useState('')
  const [intro, setIntro] = useState('')
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const router = useRouter()
  const params = useParams()
  const { showSuccess, showError, AlertDialog } = useAlertDialog()
  const timeOptions = generateTimeOptions()

  // 방송 시작 시간 선택 핸들러
  const handleStartTimeChange = (value: string) => {
    console.log(`[방송 시작 시간 선택됨] ${value}`)

    setStrmStartTm(value)
    setStrmEndTm(addOneHour(value))
  }

  // 경매 마감 시간 선택 핸들러
  const handleAuctionEndTimeChange = (value: string) => {
    console.log(`[경매 마감 시간 선택됨] ${value}`)

    setAuctionEndAt(value)
  }

  const formatDate = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const requestBrokerMutation = useRequestBroker(Number(params.id))

  const handleSubmit = () => {
    if (!strmDate || !strmStartTm || !intro.trim()) return

    const requestData = {
      strmDate: formatDate(strmDate),
      strmStartTm,
      strmEndTm,
      auctionEndAt,
      intro: intro.trim(),
    }

    console.log('[폼 전송 데이터]', requestData)

    requestBrokerMutation.mutate(requestData, {
      onSuccess: result => {
        showSuccess(result?.message || '중개 신청이 완료되었습니다!', () => {
          router.replace(`/listings/${params.id}`)
        })
      },
      onError: error => {
        showError(
          error instanceof Error ? error.message : '중개 신청에 실패했습니다. 다시 시도해주세요.'
        )
      },
    })
  }

  return (
    <div className={className || 'rounded-2xl border border-gray-300 bg-gray-50 p-4'}>
      <h3 className="mb-3 text-base font-semibold text-gray-900">방송 신청</h3>

      <div className="flex flex-col gap-4">
        {/* 날짜 선택 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">방송 날짜</label>
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild className="border-gray-200">
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !strmDate && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {strmDate ? (
                  strmDate.toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                ) : (
                  <span>날짜를 선택해주세요</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto border border-none p-0" align="start">
              <Calendar
                mode="single"
                selected={strmDate}
                onSelect={date => {
                  setStrmDate(date)
                  setIsCalendarOpen(false)
                  console.log('[방송 날짜 선택됨]', date)
                }}
                disabled={date => date < new Date(new Date().setHours(0, 0, 0, 0))}
                className={'rounded-md border-2 border-gray-200 bg-white'}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* 방송 시작 시간 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">방송 시작 시간</label>
          <Select value={strmStartTm} onValueChange={handleStartTimeChange}>
            <SelectTrigger className="w-full border border-gray-200">
              <SelectValue placeholder="시작 시간을 선택해주세요" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px] border border-gray-200 bg-white">
              {timeOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 경매 마감 시간 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">경매 마감 시간</label>
          <Select value={auctionEndAt} onValueChange={handleAuctionEndTimeChange}>
            <SelectTrigger className="w-full border border-gray-200">
              <SelectValue placeholder="경매 마감 시간을 선택해주세요" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px] border border-gray-200 bg-white">
              {timeOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 종료 시간 표시 */}
        {strmEndTm && (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">방송 종료 시간</label>
            <div className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700">
              {parseInt(strmEndTm.split(':')[0])}시 (자동 설정)
            </div>
          </div>
        )}

        {/* 자기소개 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">자기소개</label>
          <textarea
            value={intro}
            onChange={e => setIntro(e.target.value)}
            placeholder="간단한 자기소개와 중개 경력을 입력해주세요."
            rows={4}
            className="w-full resize-none rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-base text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <span className="text-xs text-gray-500">{intro.length}/200자</span>
        </div>

        {/* 신청 버튼 */}
        <Button
          onClick={handleSubmit}
          disabled={!strmDate || !strmStartTm || !intro.trim() || requestBrokerMutation.isPending}
          className="mt-2 w-full rounded-full bg-blue-500 py-6 text-sm font-semibold text-white disabled:bg-gray-300"
        >
          {requestBrokerMutation.isPending ? '신청 중...' : '중개 신청하기'}
        </Button>
      </div>

      <AlertDialog />
    </div>
  )
}
