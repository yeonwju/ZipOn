'use client'

import { ArrowLeft, BellRing, Search } from 'lucide-react'
import Link from 'next/link'

const pageTitleMap: Record<string, string> = {
  '/auction': '경매',
  '/mypage': '마이페이지',
  '/like': '찜',
  '/live': '라이브',
  '/home': '홈',
}

export default function SubHeader({ pathname }: { pathname: string }) {
  const title =
    Object.keys(pageTitleMap).find(key => pathname.startsWith(key)) &&
    pageTitleMap[
      Object.keys(pageTitleMap).find(key => pathname.startsWith(key)) as keyof typeof pageTitleMap
    ]

  return (
    <nav className="relative flex w-full items-center justify-between border-b border-gray-200 bg-white px-4 py-4">
      {/* 왼쪽: 뒤로가기 */}
      <div className="flex items-center">
        <Link href="/home" className="flex items-center transition-colors">
          <ArrowLeft size={25} />
        </Link>
      </div>

      {/* 중앙: 제목 */}
      <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-medium">{title || ''}</h1>

      {/* 오른쪽: 아이콘들 */}
      <div className="flex flex-row gap-4">
        <Link href="/search" className="flex items-center transition-colors">
          <Search size={25} />
        </Link>
        <Link href="/notice" className="flex items-center transition-colors">
          <BellRing size={25} />
        </Link>
      </div>
    </nav>
  )
}
