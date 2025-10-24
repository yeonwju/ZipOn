'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Gavel, Heart, Home, Search, TvMinimalPlay, User } from 'lucide-react'

const navItems = [
  { href: '/live', label: '라이브', icon: TvMinimalPlay },
  { href: '/auction', label: '경매', icon: Gavel },
  { href: '/home', label: '홈', icon: Home },
  { href: '/like', label: '찜', icon: Heart },
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
                className={`flex flex-col items-center gap-1 transition-colors ${
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
