'use client'

import Badge from '@mui/material/Badge'
import clsx from 'clsx'
import {BellRing, MessageCircle, Search} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function MainHeader() {
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

  return (
    <nav
      className={clsx(
        'fixed top-0 left-0 z-50 flex w-full items-center justify-between px-3 py-1 transition-all duration-300',
        'bg-white/70 shadow-[0_1px_0_rgba(0,0,0,0.05)] backdrop-blur-md',
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      )}
    >
      <div className="flex items-center">
        <Image src="/main-logo.svg" alt="logo" width={40} height={40} />
      </div>

      <div className="flex flex-row gap-4">
        <Link href="/search" className="flex flex-col items-center transition-colors">
          <Search size={17} />
        </Link>
        <Link href="/notification" className="flex flex-col items-center transition-colors">
          <Badge color="primary" badgeContent={'1'} variant={'dot'} overlap="circular">
            <BellRing size={17} />
          </Badge>
        </Link>
        <Link href="/chat" className="flex flex-col items-center transition-colors">
          <Badge color="primary" badgeContent={'1'} variant={'dot'} overlap="circular">
            <MessageCircle size={17} />
          </Badge>
        </Link>
      </div>
    </nav>
  )
}
