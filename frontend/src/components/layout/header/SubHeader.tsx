'use client'

import Badge from '@mui/material/Badge'
import clsx from 'clsx'
import { ArrowLeft, BellRing, CalendarDays, Heart, Search, Settings } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { JSX, useEffect, useState } from 'react'

type IconAction = {
  href?: string
  onClick?: () => void
  icon: JSX.Element
}

const pageTitleMap: Record<string, string> = {
  '/auction': '경매',
  '/mypage': '마이페이지',
  '/like': '찜',
  '/live/list': '라이브',
  '/home': '홈',
  '/notification': '알림',
  '/listing': '매물 상세',
  '/calendar': '라이브 일정',
  '/live/create': '라이브 생성',
}

const rightIconsMap: Record<string, IconAction[]> = {
  default: [
    { href: '/search', icon: <Search size={17} /> },
    {
      href: '/notification',
      icon: (
        <Badge color="primary" badgeContent={'1'} variant={'dot'} overlap="circular">
          <BellRing size={17} />
        </Badge>
      ),
    },
  ],
  '/mypage': [
    {
      href: '/notification',
      icon: (
        <Badge color="primary" badgeContent={'1'} variant={'dot'} overlap="circular">
          <BellRing size={17} />
        </Badge>
      ),
    },
    { href: '/mypage/edit', icon: <Settings size={17} /> },
  ],
  '/listing': [{ href: '/like', icon: <Heart size={17} /> }],
  '/live/list': [
    {
      href: '/calendar',
      icon: <CalendarDays size={17} />,
    },
    {
      href: '/notification',
      icon: (
        <Badge color="primary" badgeContent={'1'} variant={'dot'} overlap="circular">
          <BellRing size={17} />
        </Badge>
      ),
    },
  ],
  '/calendar': [
    {
      href: '/like',
      icon: (
        <Badge color="primary" badgeContent={'1'} variant={'dot'} overlap="circular">
          <BellRing size={17} />
        </Badge>
      ),
    },
  ],
  '/live/create': [],
}

interface SubHeaderProps {
  pathname: string
  title?: string
  customRightIcons?: IconAction[]
}

/**
 *
 * - 스크롤 시 부드럽게 사라짐
 * - 얇은 글씨와 여백 중심 디자인
 * - 미세한 blur + 투명도 효과
 */
export default function SubHeader({ pathname, title, customRightIcons }: SubHeaderProps) {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY && currentScrollY > 100) setIsVisible(false)
      else if (currentScrollY < lastScrollY || currentScrollY === 0) setIsVisible(true)

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const titleKey = Object.keys(pageTitleMap).find(key => pathname.startsWith(key))
  const displayTitle = title || (titleKey ? pageTitleMap[titleKey] : '')
  const rightIcons =
    customRightIcons || (titleKey && rightIconsMap[titleKey]) || rightIconsMap.default

  return (
    <nav
      className={clsx(
        'fixed top-0 left-0 z-50 flex w-full items-center justify-between px-3 py-3 transition-all duration-300',
        'bg-white/70 shadow-[0_1px_0_rgba(0,0,0,0.05)] backdrop-blur-md',
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      )}
    >
      {/* 왼쪽: 뒤로가기 */}
      <button
        onClick={() => router.back()}
        className="-ml-2 flex items-center justify-center p-2 transition-opacity hover:opacity-60"
        aria-label="뒤로가기"
      >
        <ArrowLeft size={17} />
      </button>

      {/* 중앙: 제목 */}
      <h1 className="absolute left-1/2 -translate-x-1/2 text-base font-medium text-gray-900">
        {displayTitle}
      </h1>

      {/* 오른쪽: 페이지별 아이콘 */}
      <div className="flex flex-row items-center gap-5">
        {rightIcons.map((iconAction, index) =>
          iconAction.onClick ? (
            <button
              key={index}
              onClick={iconAction.onClick}
              className="flex items-center justify-center transition-opacity hover:opacity-60"
            >
              {iconAction.icon}
            </button>
          ) : (
            <Link
              key={iconAction.href || index}
              href={iconAction.href || '#'}
              className="flex items-center justify-center transition-opacity hover:opacity-60"
            >
              {iconAction.icon}
            </Link>
          )
        )}
      </div>
    </nav>
  )
}
