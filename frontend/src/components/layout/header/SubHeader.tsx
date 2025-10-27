'use client'

import { ArrowLeft, BellRing, Heart, Search, Settings } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { JSX, useEffect, useState } from 'react'

type IconSet = { href: string; icon: JSX.Element }[]

const pageTitleMap: Record<string, string> = {
  '/auction': '경매',
  '/mypage': '마이페이지',
  '/like': '찜',
  '/live': '라이브',
  '/home': '홈',
  '/notification': '알림',
}

const rightIconsMap: Record<string, IconSet> = {
  default: [
    { href: '/search', icon: <Search size={25} /> },
    { href: '/notification', icon: <BellRing size={25} /> },
  ],
  '/mypage': [
    { href: '/notification', icon: <BellRing size={25} /> },
    { href: '/mypage/edit', icon: <Settings size={25} /> },
  ],
}

export default function SubHeader({ pathname }: { pathname: string }) {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // 스크롤을 내릴 때 (사용자가 아래로 스크롤)
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      }
      // 스크롤을 올릴 때 (사용자가 위로 스크롤)
      else if (currentScrollY < lastScrollY) {
        setIsVisible(true)
      }
      // 맨 위로 스크롤했을 때도 헤더 표시
      else if (currentScrollY === 0) {
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const titleKey = Object.keys(pageTitleMap).find(key => pathname.startsWith(key))
  const title = titleKey ? pageTitleMap[titleKey] : ''
  const rightIcons = (titleKey && rightIconsMap[titleKey]) || rightIconsMap.default

  return (
    <nav
      className={`fixed top-0 left-0 z-50 flex w-full items-center justify-between border-b border-gray-200 bg-white px-4 py-4 transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      {/* 왼쪽: 뒤로가기 */}
      <div className="flex items-center">
        <button
          onClick={() => router.back()}
          className="flex items-center transition-colors hover:opacity-70"
          aria-label="뒤로가기"
        >
          <ArrowLeft size={25} />
        </button>
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
