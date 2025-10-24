import { BellRing, Search } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  return (
    <nav className={`flex w-full flex-row items-center justify-between bg-white px-4 py-1`}>
      <div className="flex items-center">
        <Image src="/main-logo.svg" alt="logo" width={50} height={60} />
      </div>

      <div className="flex flex-row gap-4">
        <Link href="/search" className="flex flex-col items-center transition-colors">
          <Search size={25} />
        </Link>
        <Link href="/notice" className="flex flex-col items-center transition-colors">
          <BellRing size={25} />
        </Link>
      </div>
    </nav>
  )
}
