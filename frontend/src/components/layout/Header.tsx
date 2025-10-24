import React from 'react'
import { BellRing, Search } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  return (
    <nav className="fixed top-0 left-0 flex flex-row items-center justify-between border-t border-gray-200 bg-white">
      <div>
        <Image src={'@/public/main-logo.svg'} alt={'logo'} width={100} height={100} />
      </div>
      <div className={'flex flex-row gap-3'}>
        <Link href={'/search'} className={`flex flex-col items-center gap-1 transition-colors`}>
          <Search size={25} />
        </Link>
        <Link href={'/notice'} className={`flex flex-col items-center gap-1 transition-colors`}>
          <BellRing size={25} />
        </Link>
      </div>
    </nav>
  )
}
