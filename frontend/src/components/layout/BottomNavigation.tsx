'use client'

import { Building2, Home, MapPin, TvMinimalPlay, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/live/list', label: '라이브', icon: TvMinimalPlay },
  { href: '/map', label: '지도', icon: MapPin },
  { href: '/home', label: '홈', icon: Home },
  { href: '/listings', label: '매물', icon: Building2 },
  { href: '/mypage', label: '마이페이지', icon: User },
]

export default function BottomNavigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-50 border-t border-gray-200 bg-white">
      <ul className="flex justify-around py-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <li key={href}>
              <Link
                href={href}
                className={`flex flex-col items-center transition-colors ${
                  isActive ? 'text-blue-500' : 'text-gray-400'
                }`}
              >
                <Icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
                <span className="text-xs">{label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
