'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import ListingTopTabs from '@/components/layout/header/ListingsTopTabs'
import { useUser } from '@/queries/useUser'

export default function MyListingsContent() {
  const [activeTab, setActiveTab] = useState<'auction' | 'general'>('auction')
  const router = useRouter()
  const { data: user } = useUser()

  const tabs = [
    { key: 'auction' as const, label: '내 경매 매물' },
    { key: 'general' as const, label: '내 일반 매물' },
  ]

  return (
    <section>
      <ListingTopTabs activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />

      <div className="p-4">
        {activeTab === 'auction' && <div>경매 매물 리스트</div>}
        {activeTab === 'general' && <div>일반 매물 리스트</div>}
      </div>
    </section>
  )
}
