'use client'

import { CalendarIcon } from 'lucide-react'
import { useState } from 'react'

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

interface BrokerApplicationFormProps {
  onSubmit?: (data: { date: string; time: string; introduction: string }) => void
  className?: string
}

export default function BrokerApplicationForm({ onSubmit, className }: BrokerApplicationFormProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState('')
  const [introduction, setIntroduction] = useState('')
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const handleSubmit = () => {
    onSubmit?.({
      date: selectedDate ? selectedDate.toISOString().split('T')[0] : '',
      time: selectedTime,
      introduction: introduction.trim(),
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
                  !selectedDate && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? (
                  selectedDate.toLocaleDateString('ko-KR', {
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
                selected={selectedDate}
                onSelect={date => {
                  setSelectedDate(date)
                  setIsCalendarOpen(false)
                }}
                disabled={date => date < new Date(new Date().setHours(0, 0, 0, 0))}
                className={'rounded-md border-2 border-gray-200 bg-white'}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* 시간 선택 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">방송 시간</label>
          <Select value={selectedTime} onValueChange={setSelectedTime}>
            <SelectTrigger className="w-full border border-gray-200">
              <SelectValue placeholder="시간을 선택해주세요" />
            </SelectTrigger>
            <SelectContent className={'border border-gray-200 bg-white'}>
              <SelectItem value="09:00">오전 9시</SelectItem>
              <SelectItem value="10:00">오전 10시</SelectItem>
              <SelectItem value="11:00">오전 11시</SelectItem>
              <SelectItem value="12:00">오후 12시</SelectItem>
              <SelectItem value="13:00">오후 1시</SelectItem>
              <SelectItem value="14:00">오후 2시</SelectItem>
              <SelectItem value="15:00">오후 3시</SelectItem>
              <SelectItem value="16:00">오후 4시</SelectItem>
              <SelectItem value="17:00">오후 5시</SelectItem>
              <SelectItem value="18:00">오후 6시</SelectItem>
              <SelectItem value="19:00">오후 7시</SelectItem>
              <SelectItem value="20:00">오후 8시</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 자기소개 입력 */}
        <div className="flex flex-col gap-2">
          <label htmlFor="introduction" className="text-sm font-medium text-gray-700">
            자기소개
          </label>
          <textarea
            id="introduction"
            value={introduction}
            onChange={e => setIntroduction(e.target.value)}
            placeholder="간단한 자기소개와 중개 경력을 입력해주세요."
            rows={4}
            className="w-full resize-none rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
          <span className="text-xs text-gray-500">{introduction.length}/200자</span>
        </div>

        {/* 신청 버튼 */}
        <Button
          onClick={handleSubmit}
          disabled={!selectedDate || !selectedTime || !introduction.trim()}
          className="mt-2 w-full rounded-full bg-blue-500 py-6 text-sm font-semibold text-white disabled:bg-gray-300"
        >
          중개 신청하기
        </Button>
      </div>
    </div>
  )
}
