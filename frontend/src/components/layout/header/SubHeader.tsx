'use client'

import Badge from '@mui/material/Badge'
import clsx from 'clsx'
import {
  ArrowLeft,
  BellRing,
  CalendarDays,
  Heart,
  MessageCircle,
  Search,
  Settings,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { JSX, useEffect, useState } from 'react'

type IconAction = {
  href?: string
  onClick?: () => void
  icon: JSX.Element
}

/* ---------------------------------------------------
 *  1. 헬퍼 함수: 공통 Badge 아이콘 생성
 * --------------------------------------------------- */
const createBadgeIcon = (icon: JSX.Element, href: string, badgeContent?: string): IconAction => ({
  href,
  icon: (
    <Badge color="primary" badgeContent={badgeContent ?? '1'} variant="dot" overlap="circular">
      {icon}
    </Badge>
  ),
})

/* ---------------------------------------------------
 *  2. 공통 아이콘 세트 정의
 * --------------------------------------------------- */
const ICONS = {
  search: { href: '/search', icon: <Search size={17} /> },
  notification: createBadgeIcon(<BellRing size={17} />, '/notification'),
  chat: createBadgeIcon(<MessageCircle size={17} />, '/chat'),
  settings: { href: '/mypage/edit', icon: <Settings size={17} /> },
  calendar: { href: '/calendar', icon: <CalendarDays size={17} /> },
  like: { href: '/like', icon: <Heart size={17} /> },
}

/* ---------------------------------------------------
 * 🗂 3. 페이지별 아이콘 구성 맵
 * --------------------------------------------------- */
const rightIconsMap: Record<string, IconAction[]> = {
  default: [ICONS.search, ICONS.notification, ICONS.chat],
  '/auction/payment': [],
  '/auction/bid': [ICONS.notification, ICONS.chat],
  '/chat': [ICONS.search, ICONS.notification],
  '/verify/phone': [],
  '/verify/business': [],
  '/mypage/my-listings': [ICONS.notification, ICONS.chat],
  '/mypage/my-auction': [ICONS.notification, ICONS.chat],
  '/mypage': [ICONS.notification, ICONS.chat, ICONS.settings],
  '/listing': [ICONS.like],
  '/live/list': [ICONS.calendar, ICONS.notification, ICONS.chat],
  '/calendar': [ICONS.notification, ICONS.chat],
  '/live/create': [],
}

/* ---------------------------------------------------
 * 🏷 4. 페이지 타이틀 맵
 * --------------------------------------------------- */
const pageTitleMap: Record<string, string> = {
  '/auction/payment': '결제',
  '/auction/bid': '경매 입찰',
  '/verify/phone': '휴대폰 인증',
  '/verify/business': '사업자 인증',
  '/mypage/my-listings': '내 매물',
  '/mypage/my-auction': '내 경매 내역',
  '/mypage': '마이페이지',
  '/auction': '경매',
  '/like': '찜',
  '/live/list': '라이브',
  '/home': '홈',
  '/notification': '알림',
  '/listings': '매물',
  '/listing': '',
  '/calendar': '라이브 일정',
  '/live/create': '라이브 생성',
  '/chat': '채팅',
}

/* ---------------------------------------------------
 *  5. SubHeader 컴포넌트
 * --------------------------------------------------- */
interface SubHeaderProps {
  pathname?: string
  title?: string
  customRightIcons?: IconAction[]
}

export default function SubHeader({ pathname: propPath, title, customRightIcons }: SubHeaderProps) {
  const router = useRouter()
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const pathname = propPath || usePathname()
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

  /* ---------------------------------------------------
   *  6. 동적 경로 매칭 처리
   * --------------------------------------------------- */
  let dynamicTitle = ''
  let dynamicIcons: IconAction[] = rightIconsMap.default

  if (pathname.startsWith('/listings/') && pathname.endsWith('/brokers')) {
    dynamicTitle = '중개 신청'
    dynamicIcons = [ICONS.notification, ICONS.chat]
  }

  /* ---------------------------------------------------
   * 7. 정적 매칭 (기존 로직)
   * --------------------------------------------------- */
  const titleKey = Object.keys(pageTitleMap)
    .sort((a, b) => b.length - a.length)
    .find(key => pathname.startsWith(key))

  const displayTitle = title || dynamicTitle || (titleKey ? pageTitleMap[titleKey] : '')
  const rightIcons =
    customRightIcons ||
    dynamicIcons ||
    (titleKey && rightIconsMap[titleKey]) ||
    rightIconsMap.default

  return (
    <nav
      className={clsx(
        'fixed top-0 left-0 z-50 flex w-full items-center justify-between py-1 pl-3 transition-all duration-300',
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
      <div className="flex flex-row items-center">
        {rightIcons.map((action, i) =>
          action.onClick ? (
            <button
              key={i}
              onClick={action.onClick}
              className="flex h-10 w-10 items-center justify-center rounded-full transition-all hover:bg-gray-100 active:bg-gray-200"
            >
              {action.icon}
            </button>
          ) : (
            <Link
              key={action.href || i}
              href={action.href || '#'}
              className="flex h-10 w-10 items-center justify-center rounded-full transition-all hover:bg-gray-100 active:bg-gray-200"
            >
              {action.icon}
            </Link>
          )
        )}
      </div>
    </nav>
  )
}
