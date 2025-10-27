import React from 'react'

import MainHeader from '@/components/layout/MainHeader'

export default function HeaderLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <MainHeader />
      <main className="pt-13 pb-16">{children}</main>
    </div>
  )
}
