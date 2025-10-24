import BottomNavigation from '@/components/layout/BottomNavigation'
import React from 'react'

export default function TabsBottomLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <main className="pb-16">{children}</main>
      <BottomNavigation />
    </div>
  )
}
