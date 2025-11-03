'use client'

import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

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
  constructionDate: string
  parkingCnt: string
  hasElevator: boolean
  petAvailable: boolean
  isAucPref: boolean
  isBrkPref: boolean
  aucAt: string
  aucAvailable: string
}

interface Step2Props {
  step1Completed: boolean
  listingInfo: ListingInfo
  canCompleteStep2: boolean
  onListingInfoChange: (info: ListingInfo) => void
  onComplete: () => void
}

export default function Step2PropertyInfo({
  step1Completed,
  listingInfo,
  canCompleteStep2,
  onListingInfoChange,
  onComplete,
}: Step2Props) {
  const updateField = (field: keyof ListingInfo, value: string | boolean) => {
    onListingInfoChange({ ...listingInfo, [field]: value })
  }

  return (
    <AccordionItem value="item-2" className="border-0 border-b border-gray-200 pb-6">
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
            2
          </span>
          <span>매물 정보</span>
          {!step1Completed && (
            <Badge variant="outline" className="border-gray-300 text-gray-500">
              대기중
            </Badge>
          )}
        </div>
      </AccordionTrigger>
      <AccordionContent className="flex flex-col gap-8 pt-4">
        {/* 기본 정보 */}
        <div>
          <h3 className="mb-4 text-lg font-bold text-gray-900">기본 정보</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">
                임대인 이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={listingInfo.lessorNm}
                onChange={e => updateField('lessorNm', e.target.value)}
                placeholder="예: 김싸피"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">
                매물 이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={listingInfo.propertyNm}
                onChange={e => updateField('propertyNm', e.target.value)}
                placeholder="예: 멀티캠퍼스"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>

        {/* 상세 설명 */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-900">
            상세 설명 <span className="text-red-500">*</span>
          </label>
          <textarea
            value={listingInfo.content}
            onChange={e => updateField('content', e.target.value)}
            placeholder="이 집은 아주 좋습니다."
            rows={4}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* 면적 정보 */}
        <div>
          <h3 className="mb-4 text-lg font-bold text-gray-900">면적</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">
                면적 (㎡) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                value={listingInfo.area}
                onChange={e => updateField('area', e.target.value)}
                placeholder="예: 84.8"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">평수</label>
              <input
                type="number"
                value={listingInfo.areaP}
                onChange={e => updateField('areaP', e.target.value)}
                placeholder="예: 32"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>

        {/* 가격 정보 */}
        <div>
          <h3 className="mb-4 text-lg font-bold text-gray-900">가격</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">
                보증금 (원) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={listingInfo.deposit}
                onChange={e => updateField('deposit', e.target.value)}
                placeholder="예: 10000000"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">
                월세 (원) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={listingInfo.mnRent}
                onChange={e => updateField('mnRent', e.target.value)}
                placeholder="예: 800000"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">관리비 (원)</label>
              <input
                type="number"
                value={listingInfo.fee}
                onChange={e => updateField('fee', e.target.value)}
                placeholder="예: 50000"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>

        {/* 매물 상세 정보 */}
        <div>
          <h3 className="mb-4 text-lg font-bold text-gray-900">매물 상세</h3>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">
                방 개수 <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={listingInfo.roomCnt}
                onChange={e => updateField('roomCnt', e.target.value)}
                placeholder="예: 2"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">
                욕실 개수 <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={listingInfo.bathroomCnt}
                onChange={e => updateField('bathroomCnt', e.target.value)}
                placeholder="예: 1"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">층수</label>
              <input
                type="number"
                value={listingInfo.floor}
                onChange={e => updateField('floor', e.target.value)}
                placeholder="예: 5"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">방향</label>
              <select
                value={listingInfo.facing}
                onChange={e => updateField('facing', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                <option value="N">북</option>
                <option value="S">남</option>
                <option value="E">동</option>
                <option value="W">서</option>
              </select>
            </div>
          </div>
        </div>

        {/* 추가 정보 */}
        <div>
          <h3 className="mb-4 text-lg font-bold text-gray-900">추가 정보</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">
                계약 기간 (개월)
              </label>
              <input
                type="number"
                value={listingInfo.period}
                onChange={e => updateField('period', e.target.value)}
                placeholder="예: 24"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">주차 대수</label>
              <input
                type="number"
                value={listingInfo.parkingCnt}
                onChange={e => updateField('parkingCnt', e.target.value)}
                placeholder="예: 1"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">준공일</label>
              <input
                type="date"
                value={listingInfo.constructionDate}
                onChange={e => updateField('constructionDate', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>

        {/* 옵션 */}
        <div>
          <h3 className="mb-4 text-lg font-bold text-gray-900">편의시설 및 옵션</h3>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 transition hover:bg-gray-50">
              <input
                type="checkbox"
                checked={listingInfo.hasElevator}
                onChange={e => updateField('hasElevator', e.target.checked)}
                className="h-5 w-5 rounded border-gray-300 text-blue-500 focus:ring-2 focus:ring-blue-100"
              />
              <span className="text-sm font-medium text-gray-900">엘리베이터 있음</span>
            </label>
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 transition hover:bg-gray-50">
              <input
                type="checkbox"
                checked={listingInfo.petAvailable}
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
                checked={listingInfo.isAucPref}
                onChange={e => updateField('isAucPref', e.target.checked)}
                className="h-5 w-5 rounded border-gray-300 text-blue-500 focus:ring-2 focus:ring-blue-100"
              />
              <span className="text-sm font-medium text-gray-900">경매 선호</span>
            </label>
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 transition hover:bg-gray-50">
              <input
                type="checkbox"
                checked={listingInfo.isBrkPref}
                onChange={e => updateField('isBrkPref', e.target.checked)}
                className="h-5 w-5 rounded border-gray-300 text-blue-500 focus:ring-2 focus:ring-blue-100"
              />
              <span className="text-sm font-medium text-gray-900">중개 선호</span>
            </label>
          </div>
        </div>

        {/* 경매 정보 (경매 선호 시) */}
        {listingInfo.isAucPref && (
          <div>
            <h3 className="mb-4 text-lg font-bold text-gray-900">경매 정보</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  경매 희망 날짜
                </label>
                <input
                  type="date"
                  value={listingInfo.aucAt}
                  onChange={e => updateField('aucAt', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  경매 가능 시간
                </label>
                <input
                  type="text"
                  value={listingInfo.aucAvailable}
                  onChange={e => updateField('aucAvailable', e.target.value)}
                  placeholder="예: 12월 10일 오후 시간대 희망합니다."
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          </div>
        )}

        {/* 입력 완료 버튼 */}
        <div className="flex justify-end pt-4">
          <Button
            onClick={onComplete}
            disabled={!canCompleteStep2}
            size="lg"
            className="h-12 bg-blue-500 px-8 text-base font-semibold text-white hover:bg-blue-600 disabled:bg-gray-200 disabled:text-gray-400"
          >
            입력 완료
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}

