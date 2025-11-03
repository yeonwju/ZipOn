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

interface AdditionalInfo {
  images: File[]
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
  const imageInputRef = useRef<HTMLInputElement | null>(null)

  const handleImageClick = () => imageInputRef.current?.click()

  const handleImageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    if (selectedFiles.length > 0) {
      onAdditionalInfoChange({
        ...additionalInfo,
        images: [...additionalInfo.images, ...selectedFiles],
      })
    }
  }

  const handleRemoveImage = (index: number) => {
    const newImages = additionalInfo.images.filter((_, i) => i !== index)
    onAdditionalInfoChange({
      ...additionalInfo,
      images: newImages,
    })
  }

  const handleNotesChange = (notes: string) => {
    onAdditionalInfoChange({
      ...additionalInfo,
      notes,
    })
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
        {/* 매물 이미지 업로드 */}
        <div>
          <h3 className="mb-4 text-lg font-bold text-gray-900">매물 사진</h3>

          <Empty className="group flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-8 text-center transition-all hover:border-blue-500 hover:bg-blue-50">
            {additionalInfo.images.length === 0 ? (
              <>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <ImageIcon
                      className="text-gray-400 transition-colors group-hover:text-blue-500"
                      size={32}
                    />
                  </EmptyMedia>
                  <EmptyTitle className="mt-3 text-base font-medium text-gray-900">
                    사진을 업로드하세요
                  </EmptyTitle>
                  <EmptyDescription className="mt-1 text-sm text-gray-500">
                    JPG, PNG 파일을 업로드할 수 있습니다 (선택사항)
                  </EmptyDescription>
                </EmptyHeader>

                <EmptyContent>
                  <Button
                    type="button"
                    onClick={handleImageClick}
                    className="mt-4 h-10 bg-blue-500 px-6 text-sm font-semibold text-white hover:bg-blue-600"
                  >
                    사진 선택
                  </Button>
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageInputChange}
                    className="hidden"
                    multiple
                  />
                </EmptyContent>
              </>
            ) : (
              <div className="flex w-full flex-col gap-2">
                {additionalInfo.images.map((image, index) => (
                  <div
                    key={index}
                    className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-5 py-3 shadow-sm"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                        <ImageIcon className="text-blue-500" size={18} />
                      </div>
                      <span className="max-w-[200px] truncate text-sm font-medium text-gray-900">
                        {image.name}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="ml-2 text-gray-400 transition hover:text-red-500"
                      aria-label="이미지 삭제"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}

                <Button
                  type="button"
                  onClick={handleImageClick}
                  variant="outline"
                  className="mt-2 h-9 border-blue-400 text-blue-500 hover:bg-blue-50"
                >
                  다른 사진 추가
                </Button>
              </div>
            )}
          </Empty>
        </div>

        {/* 기타 특이사항 */}
        <div>
          <h3 className="mb-4 text-lg font-bold text-gray-900">기타 특이사항</h3>
          <textarea
            value={additionalInfo.notes}
            onChange={e => handleNotesChange(e.target.value)}
            placeholder="추가로 전달하고 싶은 내용을 입력해주세요 (선택사항)"
            rows={5}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
