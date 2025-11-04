'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { NAV_ITEMS } from '@/constants'

export default function BottomNavigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-50 border-t border-gray-200 bg-white">
      <ul className="flex justify-around py-2">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
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
