'use client'

import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { ImageIcon, X } from 'lucide-react'
import React, { useRef } from 'react'
import SelectPicker from '@/components/live/SelectPicker'

interface ListingInfo {
  lessorNm: string
  propertyNm: string
  content: string
  area: string
  areaP: string
  deposit: string
  mnRent: string
  fee: string
  period: string
  floor: string
  facing: string
  roomCnt: string
  bathroomCnt: string
  images: File[]
}
interface SelectItem {
  value: string
  title: string
}
interface Step2Props {
  step1Completed: boolean
  listingInfo: ListingInfo
  canCompleteStep2: boolean
  onListingInfoChange: (info: ListingInfo) => void
  onComplete: () => void
}
const mockAuctionItems = [
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
  const imageInputRef = useRef<HTMLInputElement | null>(null)

  const updateField = (field: keyof ListingInfo, value: string | boolean | File[]) => {
    const newInfo = { ...listingInfo, [field]: value }
    onListingInfoChange(newInfo)
    console.log(`📝 Step2 - ${field} 변경:`, value)
  }

  const handleImageClick = () => imageInputRef.current?.click()

  const handleImageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    if (selectedFiles.length > 0) {
      updateField('images', [...listingInfo.images, ...selectedFiles])
    }
  }

  const handleRemoveImage = (index: number) => {
    const newImages = listingInfo.images.filter((_, i) => i !== index)
    updateField('images', newImages)
  }

  // 이미지 미리보기 URL 생성
  const getImagePreview = (file: File) => {
    return URL.createObjectURL(file)
  }

  return (
    <AccordionItem value="item-2" className="border-0 border-b border-gray-200 px-4 pb-4">
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
        <div>
          <h3 className="mb-4 text-lg font-bold text-gray-900">사진</h3>

          <div className="grid grid-cols-3 gap-4">
            {listingInfo.images.map((image, index) => (
              <div key={index} className="group relative aspect-square overflow-hidden rounded-lg">
                <img
                  src={getImagePreview(image)}
                  alt={`미리보기 ${index + 1}`}
                  className="h-full w-full object-cover"
                />
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-0.5 right-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white transition-all hover:bg-black/70"
                  aria-label="이미지 삭제"
                >
                  <X size={18} />
                </button>
              </div>
            ))}

            {/* 사진 추가 버튼 */}
            <button
              type="button"
              onClick={handleImageClick}
              className="group relative flex aspect-square flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-100 transition-all hover:border-blue-500 hover:bg-blue-50"
            >
              <ImageIcon
                className="text-gray-400 transition-colors group-hover:text-blue-500"
                size={32}
              />
              <span className="text-sm font-medium text-gray-600 transition-colors group-hover:text-blue-600">
                사진 추가
              </span>
            </button>
          </div>

          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageInputChange}
            className="hidden"
            multiple
          />
        </div>

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
