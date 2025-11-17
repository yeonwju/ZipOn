'use client'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SelectItem as SelectItemType } from '@/types'
import { LiveAuctionData } from '@/types/api/live'

interface LiveAuctionPickerProps {
  auctionItems?: LiveAuctionData[] | null
  facingItems?: SelectItemType[] | null
  value?: string
  onSelect?: (value: string) => void
  title: string
  description: string
}

/**
 *  라이브 방송용 경매 매물 선택 컴포넌트
 * - 경매 대기 중인 매물 리스트를 받아 셀렉트로 표시
 * - 최대 7개까지만 보이고 이후는 스크롤 가능
 */
export default function SelectPicker({
  auctionItems,
  onSelect,
  title,
  description,
  facingItems,
  value,
}: LiveAuctionPickerProps) {
  return (
    <div className="bg-white px-4 pb-4">
      <label className="mb-2 flex items-center text-sm font-medium text-gray-700">
        {title} <span className="text-red-500">*</span>
      </label>

      <Select value={value} onValueChange={onSelect}>
        <SelectTrigger className="w-full flex-1 cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-500 transition-colors outline-none hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
          <SelectValue placeholder="선택" />
        </SelectTrigger>

        <SelectContent
          className="max-h-[14rem] w-full overflow-y-auto rounded-lg border border-gray-200 bg-white p-0 shadow-sm"
          position="popper"
        >
          <SelectGroup className="sticky top-0 z-20 w-full border-b border-gray-200 bg-white">
            <SelectLabel className="px-2 py-2 text-xs font-medium text-gray-600">
              {description}
            </SelectLabel>
          </SelectGroup>

          {/* 실제 아이템들 */}
          {auctionItems && (
            <SelectGroup className="w-full">
              {auctionItems?.map(item => (
                <SelectItem
                  key={item.propertySeq}
                  value={item.auctionSeq.toLocaleString()}
                  className="cursor-pointer px-3 py-2 text-sm hover:bg-gray-50"
                >
                  {item.propertyNm}
                </SelectItem>
              ))}
            </SelectGroup>
          )}

          {facingItems && (
            <SelectGroup className="w-full">
              {facingItems.map(item => (
                <SelectItem
                  key={item.value}
                  value={item.value}
                  className="cursor-pointer px-3 py-2 text-sm hover:bg-gray-50"
                >
                  {item.title}
                </SelectItem>
              ))}
            </SelectGroup>
          )}
        </SelectContent>
      </Select>
    </div>
  )
}
