'use client'

import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import React from 'react'

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
  const updateField = (field: keyof AdditionalInfo, value: string | boolean) => {
    const newInfo = { ...additionalInfo, [field]: value }
    onAdditionalInfoChange(newInfo)
    console.log(`📝 Step3 - ${field} 변경:`, value)
  }

  return (
    <AccordionItem value="item-3" className="border-0 border-b border-gray-200 px-4 pb-4">
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
              <label className="mb-2 block text-sm font-semibold text-gray-900">주차 대수</label>
              <input
                type="number"
                value={additionalInfo.parkingCnt}
                onChange={e => updateField('parkingCnt', e.target.value)}
                placeholder="예: 1"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">준공일</label>
              <input
                type="date"
                value={additionalInfo.constructionDate}
                onChange={e => updateField('constructionDate', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 편의시설 및 옵션 */}
        <div>
          <h3 className="mb-4 text-lg font-bold text-gray-900">편의시설 및 옵션</h3>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 transition hover:bg-gray-50">
              <input
                type="checkbox"
                checked={additionalInfo.hasElevator}
                onChange={e => updateField('hasElevator', e.target.checked)}
                className="h-5 w-5 rounded border-gray-300 text-blue-500 focus:ring-2 focus:ring-blue-100"
              />
              <span className="text-sm font-medium text-gray-900">엘리베이터 있음</span>
            </label>
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 transition hover:bg-gray-50">
              <input
                type="checkbox"
                checked={additionalInfo.petAvailable}
                onChange={e => updateField('petAvailable', e.target.checked)}
                className="h-5 w-5 rounded border-gray-300 text-blue-500 focus:ring-2 focus:ring-blue-100"
              />
              <span className="text-sm font-medium text-gray-900">반려동물 가능</span>
            </label>
          </div>
        </div>

        {/* 거래 방식 */}
        <div>
          <h3 className="mb-4 text-lg font-bold text-gray-900">거래 방식</h3>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 transition hover:bg-gray-50">
              <input
                type="checkbox"
                checked={additionalInfo.isAucPref}
                onChange={e => updateField('isAucPref', e.target.checked)}
                className="h-5 w-5 rounded border-gray-300 text-blue-500 focus:ring-2 focus:ring-blue-100"
              />
              <span className="text-sm font-medium text-gray-900">경매 선호</span>
            </label>
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 transition hover:bg-gray-50">
              <input
                type="checkbox"
                checked={additionalInfo.isBrkPref}
                onChange={e => updateField('isBrkPref', e.target.checked)}
                className="h-5 w-5 rounded border-gray-300 text-blue-500 focus:ring-2 focus:ring-blue-100"
              />
              <span className="text-sm font-medium text-gray-900">중개 선호</span>
            </label>
          </div>
        </div>

        {/* 경매 정보 (경매 선호 시) */}
        {additionalInfo.isAucPref && (
          <div>
            <h3 className="mb-4 text-lg font-bold text-gray-900">경매 정보</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  경매 희망 날짜
                </label>
                <input
                  type="date"
                  value={additionalInfo.aucAt}
                  onChange={e => updateField('aucAt', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  경매 가능 시간
                </label>
                <input
                  type="text"
                  value={additionalInfo.aucAvailable}
                  onChange={e => updateField('aucAvailable', e.target.value)}
                  placeholder="예: 12월 10일 오후 시간대 희망합니다."
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
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
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
