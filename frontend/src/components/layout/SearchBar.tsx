'use client'

import { Search, X } from 'lucide-react'
import { useState } from 'react'

import { InputGroup, InputGroupInput } from '@/components/ui/input-group'

export default function SearchBar() {
  const [value, setValue] = useState('')

  return (
    <div className="relative flex h-[52px] w-full items-center">
      {/* 입력 필드 */}
      <InputGroup className="h-[52px] rounded-lg border border-gray-300 bg-white shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
        <InputGroupInput
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="지하철, 건물명, 대학교, 아파트"
          className="border-none pr-10 pl-10 text-base text-gray-800 placeholder:text-gray-400 focus:ring-0"
        />
      </InputGroup>

      {/* 왼쪽 검색 아이콘 */}
      <Search
        size={18}
        className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
      />

      {/* 오른쪽 X 아이콘 (입력 시에만 표시) */}
      {value && (
        <button
          type="button"
          onClick={() => setValue('')}
          className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          aria-label="검색어 초기화"
        >
          <X size={18} />
        </button>
      )}
    </div>
  )
}
