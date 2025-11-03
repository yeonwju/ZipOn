'use client'

import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import React, { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ChevronDownIcon } from 'lucide-react'

interface AdditionalInfo {
  constructionDate: string
  parkingCnt: string
  hasElevator: boolean
  petAvailable: boolean
  isAucPref: boolean
  isBrkPref: boolean
  aucAt: string
  aucAvailable: string
  notes: string
}

interface Step3Props {
  step1Completed: boolean
  additionalInfo: AdditionalInfo
  onAdditionalInfoChange: (info: AdditionalInfo) => void
}

export default function Step3AdditionalInfo({
  step1Completed,
  additionalInfo,
  onAdditionalInfoChange,
}: Step3Props) {
  const [auctionDatePickerOpen, setAuctionDatePickerOpen] = useState(false)
  const [constructionDatePickerOpen, setConstructionDatePickerOpen] = useState(false)

  const [selectedAuctionDate, setSelectedAuctionDate] = useState<Date | undefined>(
    additionalInfo.aucAt ? new Date(additionalInfo.aucAt) : undefined
  )
  const [selectedConstructionDate, setSelectedConstructionDate] = useState<Date | undefined>(
    additionalInfo.constructionDate ? new Date(additionalInfo.constructionDate) : undefined
  )

  const updateField = (field: keyof AdditionalInfo, value: string | boolean) => {
    const newInfo = { ...additionalInfo, [field]: value }
    onAdditionalInfoChange(newInfo)
    console.log(`📝 Step3 - ${field} 변경:`, value)
  }

  const handleAuctionDateChange = (date: Date | undefined) => {
    setSelectedAuctionDate(date)
    if (date) {
      updateField('aucAt', date.toISOString().split('T')[0])
    } else {
      updateField('aucAt', '')
    }
    setAuctionDatePickerOpen(false)
  }

  const handleConstructionDateChange = (date: Date | undefined) => {
    setSelectedConstructionDate(date)
    if (date) {
      updateField('constructionDate', date.toISOString().split('T')[0])
    } else {
      updateField('constructionDate', '')
    }
    setConstructionDatePickerOpen(false)
  }

  return (
    <AccordionItem value="item-3" className="border-0 border-b border-gray-200 px-4 py-6">
      <AccordionTrigger
        className={`flex items-center py-0 text-xl font-bold hover:no-underline ${
          step1Completed ? 'text-gray-900' : 'cursor-not-allowed text-gray-400'
        }`}
        disabled={!step1Completed}
      >
        <div className="flex items-center gap-3">
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
              step1Completed ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'
            }`}
          >
            3
          </span>
          <span>추가 정보</span>
          {!step1Completed && (
            <Badge variant="outline" className="border-gray-300 text-gray-500">
              대기중
            </Badge>
          )}
          {step1Completed && (
            <Badge variant="outline" className="border-blue-300 text-blue-600">
              선택사항
            </Badge>
          )}
        </div>
      </AccordionTrigger>
      <AccordionContent className="flex flex-col gap-8 pt-4">
        {/* 건물 정보 */}
        <div>
          <h3 className="mb-4 text-lg font-bold text-gray-900">건물 정보</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900">주차 대수</label>
              <input
                type="number"
                value={additionalInfo.parkingCnt}
                onChange={e => updateField('parkingCnt', e.target.value)}
                placeholder="예: 1"
                className="h-[36px] w-full rounded-lg border border-gray-300 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900">준공일</label>
              <Popover
                open={constructionDatePickerOpen}
                onOpenChange={setConstructionDatePickerOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="construction-date"
                    className="h-[36px] w-full justify-between border border-gray-300 font-normal"
                  >
                    {selectedConstructionDate
                      ? selectedConstructionDate.toLocaleDateString('ko-KR')
                      : '날짜 선택'}
                    <ChevronDownIcon size={16} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden border border-gray-300 p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={selectedConstructionDate}
                    onSelect={handleConstructionDateChange}
                    className={'bg-white'}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        {/* 편의시설 및 옵션 */}
        <div>
          <h3 className="mb-4 text-lg font-bold text-gray-900">편의시설 및 옵션</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Checkbox
                id="hasElevator"
                checked={additionalInfo.hasElevator}
                onCheckedChange={checked => updateField('hasElevator', checked === true)}
                className="border border-gray-300 data-[state=checked]:border-blue-400 data-[state=checked]:bg-blue-400 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
              />
              <Label htmlFor="hasElevator">엘리베이터 있음</Label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox
                id="petAvailable"
                checked={additionalInfo.petAvailable}
                onCheckedChange={checked => updateField('petAvailable', checked === true)}
                className="border border-gray-300 data-[state=checked]:border-blue-400 data-[state=checked]:bg-blue-400 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
              />
              <Label htmlFor="petAvailable">반려동물 가능</Label>
            </div>
          </div>
        </div>

        {/* 거래 방식 */}
        <div>
          <h3 className="mb-4 text-lg font-bold text-gray-900">거래 방식</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Checkbox
                id="isAucPref"
                checked={additionalInfo.isAucPref}
                onCheckedChange={checked => updateField('isAucPref', checked === true)}
                className="border border-gray-300 data-[state=checked]:border-blue-400 data-[state=checked]:bg-blue-400 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
              />
              <Label htmlFor="isAucPref">경매 방식</Label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox
                id="isBrkPref"
                checked={additionalInfo.isBrkPref}
                onCheckedChange={checked => updateField('isBrkPref', checked === true)}
                className="border border-gray-300 data-[state=checked]:border-blue-400 data-[state=checked]:bg-blue-400 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
              />
              <Label htmlFor="isBrkPref">중개인 원함</Label>
            </div>
          </div>
        </div>

        {/* 경매 정보 (경매 선호 시) */}
        {additionalInfo.isAucPref && (
          <div>
            <h3 className="mb-4 text-lg font-bold text-gray-900">경매 정보</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900">
                  경매 희망 날짜
                </label>
                <Popover open={auctionDatePickerOpen} onOpenChange={setAuctionDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="auction-date"
                      className="h-[36px] w-full justify-between border border-gray-300 font-normal"
                    >
                      {selectedAuctionDate
                        ? selectedAuctionDate.toLocaleDateString('ko-KR')
                        : '날짜 선택'}
                      <ChevronDownIcon size={16} />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto overflow-hidden border border-gray-300 p-0"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={selectedAuctionDate}
                      onSelect={handleAuctionDateChange}
                      className={'bg-white'}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900">
                  경매 가능 시간
                </label>
                <input
                  type="text"
                  value={additionalInfo.aucAvailable}
                  onChange={e => updateField('aucAvailable', e.target.value)}
                  placeholder="예: 12월 10일 오후 시간대 희망합니다."
                  className="h-[36px] w-full rounded-lg border border-gray-300 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* 기타 특이사항 */}
        <div>
          <h3 className="mb-4 text-lg font-bold text-gray-900">기타 특이사항</h3>
          <textarea
            value={additionalInfo.notes}
            onChange={e => updateField('notes', e.target.value)}
            placeholder="추가로 전달하고 싶은 내용을 입력해주세요 (선택사항)"
            rows={5}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
