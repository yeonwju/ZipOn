'use client'

import { Search, X } from 'lucide-react'
import { useState } from 'react'

import { Input } from '@/components/ui/input'

export default function SearchBar() {
  const [searchValue, setSearchValue] = useState('')

  const handleClearSearch = () => {
    setSearchValue('')
  }

  return (
    <div className={'flex w-full items-center rounded-2xl px-4 py-2'}>
      <Input
        className={'border-none bg-[#F2F8FC]'}
        leftIcon={<Search size={18} />}
        rightIcon={
          searchValue && (
            <button
              onClick={handleClearSearch}
              className="flex items-center justify-center transition-opacity hover:opacity-70"
              aria-label="검색어 지우기"
            >
              <X size={16} />
            </button>
          )
        }
        value={searchValue}
        onChange={e => setSearchValue(e.target.value)}
        placeholder="지역, 지하철, 대학, 단지"
      />
    </div>
  )
}
