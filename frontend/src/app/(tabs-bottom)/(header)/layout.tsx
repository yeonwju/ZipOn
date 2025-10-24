import React from 'react'
import Header from '@/components/layout/Header'

export default function HeaderLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pb-16">{children}</main>
    </div>
  )
}
