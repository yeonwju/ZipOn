'use client'

import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'

interface Step3Props {
  step1Completed: boolean
}

export default function Step3AdditionalInfo({ step1Completed }: Step3Props) {
  return (
    <AccordionItem value="item-3" className="border-0 border-b border-gray-200 pb-6">
      <AccordionTrigger
        className={`mb-6 py-0 text-xl font-bold hover:no-underline ${
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
          <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center transition-colors hover:border-blue-400 hover:bg-blue-50/50">
            <p className="text-sm text-gray-500">매물 사진을 업로드해주세요 (선택사항)</p>
          </div>
        </div>

        {/* 기타 특이사항 */}
        <div>
          <h3 className="mb-4 text-lg font-bold text-gray-900">기타 특이사항</h3>
          <textarea
            placeholder="추가로 전달하고 싶은 내용을 입력해주세요 (선택사항)"
            rows={5}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}

