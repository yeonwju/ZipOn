'use client'

import React from 'react'

import ImageUploadGrid from '@/components/common/ImageUploadGrid'
import { SelectPicker } from '@/components/features/live'
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SelectItem } from '@/types'
import { ListingFormInfo as ListingInfo } from '@/types/models/listing'

interface Step2Props {
  step1Completed: boolean
  listingInfo: ListingInfo
  canCompleteStep2: boolean
  onListingInfoChange: (info: ListingInfo) => void
  onComplete: () => void
}
const mockAuctionItems: SelectItem[] = [
  { value: '1', title: '동향' },
  { value: '2', title: '서향' },
  { value: '3', title: '남향' },
  { value: '4', title: '북향' },
]

export default function Step2PropertyInfo({
  step1Completed,
  listingInfo,
  canCompleteStep2,
  onListingInfoChange,
  onComplete,
}: Step2Props) {
  const updateField = (field: keyof ListingInfo, value: string | boolean | File[]) => {
    const newInfo = { ...listingInfo, [field]: value }
    onListingInfoChange(newInfo)
  }

  return (
    <AccordionItem value="item-2" className="border-0 border-b border-gray-200 px-4 py-6">
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
            2
          </span>
          <span>
            매물 정보 <span className="text-red-500">*</span>
          </span>
          {!step1Completed && (
            <Badge variant="outline" className="border-gray-300 text-gray-500">
              대기중
            </Badge>
          )}
        </div>
      </AccordionTrigger>
      <AccordionContent className="flex flex-col gap-6 pt-4">
        {/* 기본 정보 */}
        <div>
          <h3 className="mb-4 text-lg font-bold text-gray-900">기본 정보</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900">
                임대인 이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={listingInfo.lessorNm}
                onChange={e => updateField('lessorNm', e.target.value)}
                placeholder="ex: 김싸피"
                className="h-[36px] w-full rounded-lg border border-gray-300 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900">
                매물 이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={listingInfo.propertyNm}
                onChange={e => updateField('propertyNm', e.target.value)}
                placeholder="ex: 멀티캠퍼스"
                className="h-[36px] w-full rounded-lg border border-gray-300 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 상세 설명 */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-900">
            상세 설명 <span className="text-red-500">*</span>
          </label>
          <textarea
            value={listingInfo.content}
            onChange={e => updateField('content', e.target.value)}
            placeholder="이 집은 아주 좋습니다."
            rows={4}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
          />
        </div>

        {/* 면적 정보 */}
        <div>
          <h3 className="mb-4 text-lg font-bold text-gray-900">면적</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900">
                면적 (㎡) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                value={listingInfo.area}
                onChange={e => updateField('area', e.target.value)}
                placeholder="ex: 84.8"
                className="h-[36px] w-full rounded-lg border border-gray-300 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900">평수</label>
              <input
                type="number"
                value={listingInfo.areaP}
                onChange={e => updateField('areaP', e.target.value)}
                placeholder="ex: 32"
                className="h-[36px] w-full rounded-lg border border-gray-300 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 가격 정보 */}
        <div>
          <h3 className="mb-4 text-lg font-bold text-gray-900">가격</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900">
                보증금 (원) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={listingInfo.deposit}
                onChange={e => updateField('deposit', e.target.value)}
                placeholder="ex: 10000000"
                className="h-[36px] w-full rounded-lg border border-gray-300 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900">
                월세 (원) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={listingInfo.mnRent}
                onChange={e => updateField('mnRent', e.target.value)}
                placeholder="ex: 800000"
                className="h-[36px] w-full rounded-lg border border-gray-300 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900">관리비 (원)</label>
              <input
                type="number"
                value={listingInfo.fee}
                onChange={e => updateField('fee', e.target.value)}
                placeholder="ex: 50000"
                className="h-[36px] w-full rounded-lg border border-gray-300 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-bold text-gray-900">매물 상세</h3>
          <div className="flex flex-row gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900">
                방 개수 <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={listingInfo.roomCnt}
                onChange={e => updateField('roomCnt', e.target.value)}
                placeholder="ex: 2"
                className="h-[36px] w-full rounded-lg border border-gray-300 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900">
                욕실 개수 <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={listingInfo.bathroomCnt}
                onChange={e => updateField('bathroomCnt', e.target.value)}
                placeholder="ex: 1"
                className="h-[36px] w-full rounded-lg border border-gray-300 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900">층수</label>
              <input
                type="number"
                value={listingInfo.floor}
                onChange={e => updateField('floor', e.target.value)}
                placeholder="ex: 5"
                className="h-[36px] w-full rounded-lg border border-gray-300 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 추가 정보 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">계약 기간 (개월)</label>
            <input
              type="number"
              value={listingInfo.period}
              onChange={e => updateField('period', e.target.value)}
              placeholder="ex: 24"
              className="h-[36px] w-full rounded-lg border border-gray-300 px-4 py-2 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
            />
          </div>
          <SelectPicker title={'방향'} description={'방향 목록'} auctionItems={mockAuctionItems} />
        </div>

        {/* 매물 이미지 업로드 */}
        <ImageUploadGrid
          images={listingInfo.images}
          onImagesChange={images => updateField('images', images)}
        />

        {/* 입력 완료 버튼 */}
        <div className="flex justify-end pt-4">
          <Button
            onClick={onComplete}
            disabled={!canCompleteStep2}
            size="lg"
            className="h-12 bg-blue-500 px-8 text-base font-medium text-white hover:bg-blue-600 disabled:bg-gray-200 disabled:text-gray-400"
          >
            입력 완료
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
