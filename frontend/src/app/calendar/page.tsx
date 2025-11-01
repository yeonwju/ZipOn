'use client'

import { BellPlus } from 'lucide-react'
import React, { useState } from 'react'

import { Calendar } from '@/components/common/ui/calendar'

export default function CalendarPage() {
  const today = new Date()

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(today)
  const [highlightDates] = useState<Date[]>([
    new Date(2025, 10, 3),
    new Date(2025, 10, 12),
    new Date(2025, 10, 25),
    today,
  ])

  const handleSelect = (date?: Date) => {
    setSelectedDate(date)
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={handleSelect}
        highlightDates={highlightDates}
        className="[--cell-size:1.5rem] md:[--cell-size:2.5rem]"
        buttonVariant="ghost"
      />
      <div className="w-full max-w-[320px]">
        {selectedDate ? (
          <div className="text-left text-sm text-gray-700">
            <strong>{selectedDate.toLocaleDateString('ko-KR', { dateStyle: 'long' })}</strong>
            <div
              className={
                'mt-2 flex w-full flex-row items-center justify-between gap-2 rounded-md border-2 border-gray-300 p-2'
              }
            >
              <div className={'flex gap-2'}>
                <span>14:00</span>
                <span>송파 푸르지오</span>
              </div>
              <BellPlus size={20} />
            </div>
          </div>
        ) : (
          <p className="text-center text-sm text-gray-400">날짜를 선택하세요.</p>
        )}
      </div>
    </div>
  )
}
