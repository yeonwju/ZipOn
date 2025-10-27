'use client'
import { ChevronDown, Funnel, RefreshCw } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export default function SearchFilter() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showLeftBlur, setShowLeftBlur] = useState(false)
  const [showRightBlur, setShowRightBlur] = useState(true)

  const checkScrollPosition = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setShowLeftBlur(scrollLeft > 0)
      setShowRightBlur(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  useEffect(() => {
    const scrollElement = scrollRef.current
    if (scrollElement) {
      checkScrollPosition()
      scrollElement.addEventListener('scroll', checkScrollPosition)
      return () => scrollElement.removeEventListener('scroll', checkScrollPosition)
    }
  }, [])

  return (
    <div className="relative flex w-full flex-row items-center justify-between gap-2 border-y border-gray-200 bg-white px-2 py-2">
      {/* 왼쪽 블러 (스크롤 가능할 때만 표시) */}
      {showLeftBlur && (
        <div className="pointer-events-none absolute top-0 left-0 z-20 h-full w-15 bg-gradient-to-r from-white to-transparent" />
      )}

      {/* 오른쪽 블러 (스크롤 가능할 때만 표시) */}
      {showRightBlur && (
        <div className="pointer-events-none absolute top-0 right-0 z-20 h-full w-15 bg-gradient-to-l from-white to-transparent" />
      )}

      {/* 새로고침 버튼 */}
      <button
        onClick={() => console.log('리셋')}
        className="z-10 flex shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white p-2 shadow-sm"
      >
        <RefreshCw size={15} className="text-gray-600" />
      </button>

      {/* 지역 필터 (스크롤 테스트용 버튼 많게) */}
      <div ref={scrollRef} className="scrollbar-hide flex flex-1 flex-row gap-2 overflow-x-auto scroll-smooth bg-white">
        {[
          '서울',
          '경기',
          '인천',
          '부산',
          '대전',
          '광주',
          '대구',
          '울산',
          '세종',
          '강원',
          '충북',
          '충남',
          '전북',
          '전남',
          '경북',
          '경남',
          '제주',
          '독도',
          '마라도',
          '속초',
          '양양',
          '거제',
        ].map(region => (
          <button
            key={region}
            onClick={() => console.log(region)}
            className="flex shrink-0 items-center gap-1 rounded-full border border-gray-300 bg-gray-50 px-4 py-2 text-xs text-gray-700 hover:bg-gray-100"
          >
            <span>{region}</span>
            <ChevronDown className="h-3 w-3 text-gray-500" />
          </button>
        ))}
      </div>

      {/* 전체 필터 버튼 */}
      <button
        onClick={() => console.log('필터')}
        className="z-10 flex shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white p-2 shadow-sm"
      >
        <Funnel className="h-4 w-4 text-gray-600" />
      </button>
    </div>
  )
}
