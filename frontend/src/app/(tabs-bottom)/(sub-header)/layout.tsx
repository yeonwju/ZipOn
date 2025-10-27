'use client'

import { usePathname } from 'next/navigation'
import React from 'react'

import SubHeader from '@/components/layout/SubHeader'

export default function SubHeaderLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen">
      <SubHeader pathname={pathname} />
      <main className="pt-13 pb-16">{children}</main>
    </div>
  )
}
