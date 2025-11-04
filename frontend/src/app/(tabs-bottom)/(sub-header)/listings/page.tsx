'use client'

import { HousePlus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import ListingTopTabs from '@/components/layout/header/ListingsTopTabs'
import FabDial from '@/components/ui/FabDial'
import { ROUTES } from '@/constants'

export default function ListingsPage() {
  const [activeTab, setActiveTab] = useState<'auction' | 'general' | 'broker'>('auction')
  const router = useRouter()
  const actions = [
    {
      icon: <HousePlus className="h-5 w-5" />,
      name: '매물 등록',
      onClick: () => router.push(ROUTES.LISTING_NEW),
    },
  ]
  return (
    <section>
      <ListingTopTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="p-4">
        {activeTab === 'auction' && <div> 경매 매물 리스트</div>}
        {activeTab === 'general' && <div> 일반 매물 리스트</div>}
        {activeTab === 'broker' && <div> 중개 대기 매물 리스트</div>}
      </div>
      <FabDial actions={actions} />
    </section>
  )
}
