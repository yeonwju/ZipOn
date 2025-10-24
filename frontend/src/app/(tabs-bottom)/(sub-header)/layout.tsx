'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import SubHeader from '@/components/layout/SubHeader'

export default function SubHeaderLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen">
      <SubHeader pathname={pathname} />
      <main className="pb-16">{children}</main>
    </div>
  )
}
