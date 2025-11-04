/**
 * 하단 네비게이션 설정
 */

import { Building2, Home, MapPin, TvMinimalPlay, User } from 'lucide-react'

import { ROUTES } from './routes'

export const NAV_ITEMS = [
  {
    href: ROUTES.LIVE,
    label: '라이브',
    icon: TvMinimalPlay,
  },
  {
    href: ROUTES.MAP,
    label: '지도',
    icon: MapPin,
  },
  {
    href: ROUTES.HOME,
    label: '홈',
    icon: Home,
  },
  {
    href: ROUTES.LISTINGS,
    label: '매물',
    icon: Building2,
  },
  {
    href: ROUTES.MYPAGE,
    label: '마이페이지',
    icon: User,
  },
] as const
