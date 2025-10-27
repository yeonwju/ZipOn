'use client'

import { BellRing, Search } from 'lucide-react'
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
      className={`fixed top-0 left-0 z-50 flex w-full flex-row items-center justify-between bg-white px-4 py-1 transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="flex items-center">
        <Image src="/main-logo.svg" alt="logo" width={50} height={60} />
      </div>

      <div className="flex flex-row gap-4">
        <Link href="/search" className="flex flex-col items-center transition-colors">
          <Search size={25} />
        </Link>
        <Link href="/notification" className="flex flex-col items-center transition-colors">
          <BellRing size={25} />
        </Link>
      </div>
    </nav>
  )
}
