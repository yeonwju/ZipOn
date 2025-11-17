'use client'

import { Filter, Search, X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

import AucListingCard from '@/components/features/listings/AucListingCard'
import { type SearchFilters, useSearchListings } from '@/queries/useSearch'
import type {
  AreaFilter,
  DirectionFilter,
  FloorFilter,
  PriceFilter,
  RoomCountFilter,
} from '@/types/filter'
import type { BuildingType } from '@/types/models/listing'

const RECENT_SEARCHES_KEY = 'recent_searches'
const MAX_RECENT_SEARCHES = 5

export default function SearchPageClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [keyword, setKeyword] = useState('')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [filters, setFilters] = useState<{
    price?: PriceFilter
    area?: AreaFilter
    roomCount?: RoomCountFilter
    floor?: FloorFilter
    direction?: DirectionFilter
    buildingType?: BuildingType | 'all'
  }>({})

  // URL에서 필터 상태 복원
  useEffect(() => {
    const filtersParam = searchParams.get('filters')
    if (filtersParam) {
      try {
        const parsedFilters = JSON.parse(decodeURIComponent(filtersParam))
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFilters(parsedFilters)
        // 필터가 적용되면 검색 실행
        setSearchKeyword(keyword || '')
      } catch {
        // 파싱 실패 시 무시
      }
    }
  }, [searchParams, keyword])

  // 최근 검색어 로드
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY)
      if (saved) {
        try {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setRecentSearches(JSON.parse(saved))
        } catch {
          setRecentSearches([])
        }
      }
    }
  }, [])

  // 검색 실행
  const searchFilters: SearchFilters = useMemo(
    () => ({
      keyword: searchKeyword,
      ...filters,
    }),
    [searchKeyword, filters]
  )

  const { data, isLoading, isError } = useSearchListings(
    searchFilters,
    !!searchKeyword || Object.keys(filters).length > 0
  )

  // 최근 검색어 저장
  const saveRecentSearch = (search: string) => {
    if (!search.trim()) return

    const updated = [search, ...recentSearches.filter(s => s !== search)].slice(
      0,
      MAX_RECENT_SEARCHES
    )
    setRecentSearches(updated)
    if (typeof window !== 'undefined') {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
    }
  }

  // 검색 실행
  const handleSearch = () => {
    if (!keyword.trim()) return
    setSearchKeyword(keyword.trim())
    saveRecentSearch(keyword.trim())
  }

  // Enter 키로 검색
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  // 최근 검색어 클릭
  const handleRecentSearchClick = (search: string) => {
    setKeyword(search)
    setSearchKeyword(search)
    saveRecentSearch(search)
  }

  // 최근 검색어 삭제
  const handleDeleteRecentSearch = (search: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const updated = recentSearches.filter(s => s !== search)
    setRecentSearches(updated)
    if (typeof window !== 'undefined') {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
    }
  }

  // 필터 초기화
  const handleFilterReset = () => {
    setFilters({})
    setSearchKeyword('')
    setKeyword('')
  }

  // 필터가 적용되었는지 확인
  const hasActiveFilters = useMemo(() => {
    if (filters.price) {
      const { deposit, rent, maintenance } = filters.price
      if (
        deposit.min > 0 ||
        deposit.max !== null ||
        rent.min > 0 ||
        rent.max !== null ||
        maintenance.min > 0 ||
        maintenance.max !== null
      ) {
        return true
      }
    }
    if (filters.area && (filters.area.min > 1 || filters.area.max < 101)) return true
    if (filters.roomCount && filters.roomCount !== 'all') return true
    if (filters.floor && filters.floor !== 'all') return true
    if (filters.direction && filters.direction !== 'all') return true
    if (filters.buildingType && filters.buildingType !== 'all') return true
    return false
  }, [filters])

  return (
    <div className="flex flex-col">
      {/* 검색 바 */}
      <div className="sticky top-0 z-40 bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center gap-2">
          {/* 검색 입력 */}
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="매물명, 주소, 지역으로 검색"
              className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2.5 pr-4 pl-10 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
            />
            {keyword && (
              <button
                onClick={() => {
                  setKeyword('')
                  setSearchKeyword('')
                }}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* 필터 버튼 */}
          <button
            onClick={() => {
              // 현재 필터 상태를 URL에 포함하여 필터 페이지로 이동
              const filtersJson = encodeURIComponent(JSON.stringify(filters))
              router.push(`/search/filter?filters=${filtersJson}`)
            }}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all ${
              hasActiveFilters
                ? 'border-blue-500 bg-blue-50 text-blue-600'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="h-4 w-4" />
            필터
            {hasActiveFilters && <span className="ml-1 h-1.5 w-1.5 rounded-full bg-blue-600" />}
          </button>
        </div>

        {/* 필터 초기화 버튼 */}
        {hasActiveFilters && (
          <button
            onClick={handleFilterReset}
            className="mt-2 text-xs text-blue-600 hover:text-blue-700"
          >
            필터 초기화
          </button>
        )}
      </div>

      {/* 최근 검색어 (검색 결과가 없을 때만 표시) */}
      {!searchKeyword && !hasActiveFilters && recentSearches.length > 0 && (
        <div className="px-4 py-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">최근 검색어</h2>
            <button
              onClick={() => {
                setRecentSearches([])
                if (typeof window !== 'undefined') {
                  localStorage.removeItem(RECENT_SEARCHES_KEY)
                }
              }}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              전체 삭제
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((search, index) => (
              <div
                key={index}
                className="group flex items-center gap-1.5 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 transition-all hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600"
              >
                <button
                  onClick={() => handleRecentSearchClick(search)}
                  className="flex-1 text-left"
                >
                  <span>{search}</span>
                </button>
                <button
                  onClick={e => handleDeleteRecentSearch(search, e)}
                  className="text-gray-400 hover:text-gray-600"
                  type="button"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 검색 결과 */}
      {searchKeyword || hasActiveFilters ? (
        <div className="flex-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500">검색 중...</div>
            </div>
          ) : isError ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500">검색 중 오류가 발생했습니다.</div>
            </div>
          ) : data?.items && data.items.length > 0 ? (
            <div>
              <div className="px-4 py-3 text-sm text-gray-600">
                총 <span className="font-semibold text-gray-900">{data.total}</span>개의 매물이
                검색되었습니다.
              </div>
              <div className="divide-y divide-gray-200 bg-white">
                {data.items.map(item => (
                  <AucListingCard key={item.propertySeq} listing={item} />
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="mb-2 text-gray-500">검색 결과가 없습니다.</div>
              <div className="text-sm text-gray-400">다른 검색어나 필터를 시도해보세요.</div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center py-12">
          <div className="text-center">
            <Search className="mx-auto mb-3 h-12 w-12 text-gray-300" />
            <div className="text-sm text-gray-500">검색어를 입력하거나 필터를 선택해주세요.</div>
          </div>
        </div>
      )}
    </div>
  )
}
