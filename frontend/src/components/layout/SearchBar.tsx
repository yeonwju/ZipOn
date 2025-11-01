'use client'

import { Search, X } from 'lucide-react'
import { useState } from 'react'

import { Input } from '../common/ui/input'

export default function SearchBar() {
  const [searchValue, setSearchValue] = useState('')

  const handleClearSearch = () => {
    setSearchValue('')
  }

  return (
    <div className={'flex h-full w-full items-center rounded-md bg-white'}>
      <Input
        className={'border-none bg-white'}
        leftIcon={<Search size={15} />}
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
