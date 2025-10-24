'use client'

import { ArrowLeft, BellRing, Search, Settings, Heart } from 'lucide-react'
import Link from 'next/link'
import { JSX } from 'react'

type IconSet = { href: string; icon: JSX.Element }[]

const pageTitleMap: Record<string, string> = {
  '/auction': '경매',
  '/mypage': '마이페이지',
  '/like': '찜',
  '/live': '라이브',
  '/home': '홈',
}

const rightIconsMap: Record<string, IconSet> = {
  default: [
    { href: '/search', icon: <Search size={25} /> },
    { href: '/notice', icon: <BellRing size={25} /> },
  ],
  '/mypage': [
    { href: '/mypage/edit', icon: <Settings size={25} /> },
    { href: '/like', icon: <Heart size={25} /> },
  ],
}

export default function SubHeader({ pathname }: { pathname: string }) {
  const titleKey = Object.keys(pageTitleMap).find(key => pathname.startsWith(key))
  const title = titleKey ? pageTitleMap[titleKey] : ''
  const rightIcons = (titleKey && rightIconsMap[titleKey]) || rightIconsMap.default

  return (
    <nav className="relative flex w-full items-center justify-between border-b border-gray-200 bg-white px-4 py-4">
      {/* 왼쪽: 뒤로가기 */}
      <div className="flex items-center">
        <Link href="/home" className="flex items-center transition-colors">
          <ArrowLeft size={25} />
        </Link>
      </div>

      {/* 중앙: 제목 */}
      <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-medium">{title}</h1>

      {/* 오른쪽: 페이지별 아이콘 */}
      <div className="flex flex-row gap-4">
        {rightIcons.map(({ href, icon }) => (
          <Link key={href} href={href} className="flex items-center transition-colors">
            {icon}
          </Link>
        ))}
      </div>
    </nav>
  )
}
