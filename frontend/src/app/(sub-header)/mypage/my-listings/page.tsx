'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import ListingTopTabs from '@/components/layout/header/ListingsTopTabs'
import { useUserStore } from '@/store/user'

// TODO 내 매물 리스트 페이지 개발
export default function MyListingsPage() {
  const [activeTab, setActiveTab] = useState<'auction' | 'general'>('auction')
  const router = useRouter()
  const user = useUserStore(state => state.user)

  const tabs = [
    { key: 'auction' as const, label: '내 경매 매물' },
    { key: 'general' as const, label: '내 일반 매물' },
  ]

  return (
    <section>
      <ListingTopTabs activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />

      <div className="p-4">
        {activeTab === 'auction' && <div> 경매 매물 리스트</div>}
        {activeTab === 'general' && <div> 일반 매물 리스트</div>}
      </div>
    </section>
  )
}
