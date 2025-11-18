'use client'

import { HousePlus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import AucListingCard from '@/components/features/listings/AucListingCard'
import ListingTopTabs from '@/components/layout/header/ListingsTopTabs'
import FabDial from '@/components/ui/FabDial'
import { ROUTES } from '@/constants'
import { useBrkListings, useGeneralListings } from '@/queries/useListing'
import { useUser } from '@/queries/useUser'

export default function ListingsTabContent() {
  const [activeTab, setActiveTab] = useState<'general' | 'broker'>('general')
  const router = useRouter()
  const { data: user } = useUser()

  const { data: generalData, isLoading: isGeneralLoading } = useGeneralListings()
  const { data: brokerData, isLoading: isBrokerLoading } = useBrkListings()

  const tabs = [
    { key: 'general' as const, label: '일반 매물' },
    { key: 'broker' as const, label: '중개' },
  ]

  const actions = [
    {
      icon: <HousePlus className="h-5 w-5" />,
      name: '매물 등록',
      onClick: () => router.push(ROUTES.LISTING_NEW),
    },
  ]

  const isLoading = activeTab === 'general' ? isGeneralLoading : isBrokerLoading

  return (
    <section>
      <ListingTopTabs activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />

      <div className="min-h-[400px]">
        <>
          {activeTab === 'general' && (
            <div>
              {generalData?.items && generalData.items.length > 0 ? (
                generalData.items.map(item => (
                  <AucListingCard key={item.propertySeq} listing={item} />
                ))
              ) : (
                <div className="flex items-center justify-center p-8">
                  <div className="text-gray-500">일반 매물이 없습니다.</div>
                </div>
              )}
            </div>
          )}
          {activeTab === 'broker' && (
            <div>
              {brokerData?.items && brokerData.items.length > 0 ? (
                brokerData.items.map(item => (
                  <AucListingCard key={item.propertySeq} listing={item} />
                ))
              ) : (
                <div className="flex items-center justify-center p-8">
                  <div className="text-gray-500">중개 대기 매물이 없습니다.</div>
                </div>
              )}
            </div>
          )}
        </>
      </div>
      {user?.isVerified && <FabDial actions={actions} />}
    </section>
  )
}
