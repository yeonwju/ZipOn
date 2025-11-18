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
import { useShallow } from 'zustand/react/shallow'

import { useGetChatRoomList } from '@/queries/useChat'
import { useChatStore } from '@/store/chatStore'

type IconAction = {
  href?: string
  onClick?: () => void
  icon: JSX.Element
}

/* ---------------------------------------------------
 * 1 Badge 아이콘 생성 헬퍼
 * --------------------------------------------------- */
const createBadgeIcon = (
  icon: JSX.Element,
  href: string,
  badgeContent?: string | number | null
): IconAction => {
  if (badgeContent === null || badgeContent === undefined || badgeContent === 0) {
    return {
      href,
      icon,
    }
  }

  return {
    href,
    icon: (
      <Badge color="primary" badgeContent={badgeContent} variant="dot" overlap="circular">
        {icon}
      </Badge>
    ),
  }
}

/* ---------------------------------------------------
 *  2 기본 아이콘 (뱃지 없음)
 * --------------------------------------------------- */
const BASE_ICONS = {
  search: { href: '/search', icon: <Search size={17} /> },
  notification: { href: '/notification', icon: <BellRing size={17} /> },
  chat: { href: '/chat', icon: <MessageCircle size={17} /> },
  settings: { href: '/mypage/edit', icon: <Settings size={17} /> },
  calendar: { href: '/calendar', icon: <CalendarDays size={17} /> },
  like: { href: '/like', icon: <Heart size={17} /> },
}

/* ---------------------------------------------------
 *  기존 ICONS (하위 호환성을 위해 유지)
 * --------------------------------------------------- */
const ICONS = {
  search: BASE_ICONS.search,
  notification: BASE_ICONS.notification,
  chat: BASE_ICONS.chat,
  settings: BASE_ICONS.settings,
  calendar: BASE_ICONS.calendar,
  like: BASE_ICONS.like,
}

/* ---------------------------------------------------
 * 3 기본 아이콘 매핑 (뱃지 정보는 컴포넌트에서 동적으로 생성)
 * --------------------------------------------------- */
const getDefaultIcons = (
  hasChatNotification: boolean,
  hasNotification: boolean = false
): IconAction[] => {
  const notificationIcon = hasNotification
    ? createBadgeIcon(<BellRing size={17} />, '/notification', 1)
    : BASE_ICONS.notification

  const chatIcon = hasChatNotification
    ? createBadgeIcon(<MessageCircle size={17} />, '/chat', 1)
    : BASE_ICONS.chat

  return [BASE_ICONS.search, notificationIcon, chatIcon]
}

const rightIconsMap: Record<string, (hasChatNotification: boolean) => IconAction[]> = {
  default: (hasChatNotification: boolean) => getDefaultIcons(hasChatNotification),
  '/search/filter': () => [],
  '/listings/new': () => [],
  '/auction/payment': () => [],
  '/auction/bid': (hasChatNotification: boolean) => [
    BASE_ICONS.notification,
    hasChatNotification
      ? createBadgeIcon(<MessageCircle size={17} />, '/chat', 1)
      : BASE_ICONS.chat,
  ],
  '/chat': () => [BASE_ICONS.search, BASE_ICONS.notification],
  '/verify/phone': () => [],
  '/verify/business': () => [],
  '/mypage/my-listings': (hasChatNotification: boolean) => [
    BASE_ICONS.notification,
    hasChatNotification
      ? createBadgeIcon(<MessageCircle size={17} />, '/chat', 1)
      : BASE_ICONS.chat,
  ],
  '/mypage/my-auction': (hasChatNotification: boolean) => [
    BASE_ICONS.notification,
    hasChatNotification
      ? createBadgeIcon(<MessageCircle size={17} />, '/chat', 1)
      : BASE_ICONS.chat,
  ],
  '/mypage': (hasChatNotification: boolean) => [
    BASE_ICONS.notification,
    hasChatNotification
      ? createBadgeIcon(<MessageCircle size={17} />, '/chat', 1)
      : BASE_ICONS.chat,
    BASE_ICONS.settings,
  ],
  '/listing': () => [BASE_ICONS.like],
  '/live/list': (hasChatNotification: boolean) => [
    BASE_ICONS.calendar,
    BASE_ICONS.notification,
    hasChatNotification
      ? createBadgeIcon(<MessageCircle size={17} />, '/chat', 1)
      : BASE_ICONS.chat,
  ],
  '/calendar': (hasChatNotification: boolean) => [
    BASE_ICONS.notification,
    hasChatNotification
      ? createBadgeIcon(<MessageCircle size={17} />, '/chat', 1)
      : BASE_ICONS.chat,
  ],
  '/live/create': () => [],
}

/* ---------------------------------------------------
 * 4 기본 타이틀 매핑
 * --------------------------------------------------- */
const pageTitleMap: Record<string, string> = {
  '/search/filter': '필터',
  '/listings/new': '매물 등록',
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
 * 5 SubHeader 컴포넌트
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
  const [canGoBack, setCanGoBack] = useState(false)

  // 채팅방 목록 조회하여 읽지 않은 메시지가 있는지 확인
  const { data: chatRooms } = useGetChatRoomList()

  // Zustand에서 실시간 읽지 않은 메시지 수 확인 (WebSocket 알림 즉시 반영)
  const totalUnreadCount = useChatStore(useShallow(state => state.getTotalUnreadCount()))

  // 서버 데이터와 Zustand 데이터 병합하여 확인
  const serverUnreadCount = chatRooms?.reduce((sum, room) => sum + (room.unreadCount ?? 0), 0) ?? 0
  const hasChatNotification = totalUnreadCount > 0 || serverUnreadCount > 0

  /* 앱 내부 히스토리 체크 */
  useEffect(() => {
    // 브라우저 히스토리 길이로 뒤로가기 가능 여부 판단
    // 히스토리 길이가 1보다 크면 뒤로가기 가능
    const hasHistory = window.history.length > 1
    setCanGoBack(hasHistory)
  }, [pathname])

  /* 스크롤 시 헤더 숨김 처리 */
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

  /* 뒤로가기 핸들러 */
  const handleBack = () => {
    // 로그인 플로우에서 온 경우 처리
    const fromPath = sessionStorage.getItem('auth_from_path')
    if (fromPath) {
      sessionStorage.removeItem('auth_from_path')
      sessionStorage.removeItem('should_skip_onboard')
      router.replace(fromPath)
      return
    }

    // 브라우저 히스토리가 있으면 뒤로가기 (일반적인 네비게이션 플로우)
    // 채팅방에서도 일반적인 뒤로가기 사용 (채팅 목록에서 왔다면 채팅 목록으로, 다른 곳에서 왔다면 그곳으로)
    if (window.history.length > 1) {
      router.back()
    } else {
      // 히스토리가 없으면 (앱 첫 진입 등) 홈으로
      router.replace('/home')
    }
  }

  /* ---------------------------------------------------
   * 6 동적 경로 처리 (정규식 기반)
   * --------------------------------------------------- */
  let dynamicTitle = ''
  let dynamicIcons: IconAction[] | null = null // ✅ 초기값을 null로 변경 (중복 방지)

  if (/^\/listings\/\d+\/brokers$/.test(pathname)) {
    dynamicTitle = '중개 신청'
    dynamicIcons = [
      BASE_ICONS.notification,
      hasChatNotification
        ? createBadgeIcon(<MessageCircle size={17} />, '/chat', 1)
        : BASE_ICONS.chat,
    ]
  } else if (/^\/listings\/\d+\/brokers\/apply$/.test(pathname)) {
    dynamicTitle = '중개인 선택'
    dynamicIcons = [
      BASE_ICONS.notification,
      hasChatNotification
        ? createBadgeIcon(<MessageCircle size={17} />, '/chat', 1)
        : BASE_ICONS.chat,
    ]
  } else if (/^\/auction\/\d+$/.test(pathname)) {
    dynamicTitle = '경매 입찰'
    dynamicIcons = [
      BASE_ICONS.notification,
      hasChatNotification
        ? createBadgeIcon(<MessageCircle size={17} />, '/chat', 1)
        : BASE_ICONS.chat,
    ]
  } else if (/^\/auction\/\d+\/payment\/pending$/.test(pathname)) {
    dynamicTitle = '결제 대기'
    dynamicIcons = []
  } else if (/^\/auction\/\d+\/payment\/complete$/.test(pathname)) {
    dynamicTitle = '결제 완료'
    dynamicIcons = []
  }

  /* ---------------------------------------------------
   * 7 기존 정적 매칭 + 동적 매칭 통합
   * --------------------------------------------------- */
  const titleKey = Object.keys(pageTitleMap)
    .sort((a, b) => b.length - a.length)
    .find(key => pathname.startsWith(key))

  const displayTitle = title || dynamicTitle || (titleKey ? pageTitleMap[titleKey] : '')
  const rightIcons =
    customRightIcons ||
    dynamicIcons || // ✅ null이 아닐 때만 덮어씀
    (titleKey && rightIconsMap[titleKey]?.(hasChatNotification)) ||
    rightIconsMap.default(hasChatNotification)

  /* ---------------------------------------------------
   * 8 렌더링
   * --------------------------------------------------- */
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
        onClick={handleBack}
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
