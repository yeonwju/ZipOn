import React from 'react'

import BottomNavigation from '@/components/layout/BottomNavigation'

export default function TabsBottomLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full min-h-screen">
      <main>{children}</main>
      <BottomNavigation />
    </div>
  )
}
