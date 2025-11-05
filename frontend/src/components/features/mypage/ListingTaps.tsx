import { Tabs, TabsList } from '@radix-ui/react-tabs'
import { Suspense } from 'react'

import AuctionHistoryList from '@/components/features/mypage/autcion-history/AuctionHistoryList'
import AuctionHistoryListSkeleton from '@/components/features/mypage/skeleton/AuctionHistoryListSkeleton'
import { TabsContent, TabsTrigger } from '@/components/ui/tabs'
import { useUserStore } from '@/store/user'

interface ListingTapsProps {
  className?: string
}

export default function ListingTaps({ className }: ListingTapsProps) {
  const { user } = useUserStore.getState()
  const isBrokerUser = user?.isBroker

  return (
    <div className={className}>
      <Tabs defaultValue={'auction'} className={'flex w-full flex-col'}>
        <TabsList className={'w-full'}>
          {isBrokerUser ? (
            <div className={'grid w-full grid-cols-3 rounded-md bg-gray-100 p-1'}>
              <TabsTrigger value={'auction'} className={'flex-1 data-[state=active]:bg-white'}>
                경매 내역
              </TabsTrigger>
              <TabsTrigger
                value={'general-listings'}
                className={'flex-1 data-[state=active]:bg-white'}
              >
                일반 매물
              </TabsTrigger>
              <TabsTrigger
                value={'auction-listings'}
                className={'flex-1 data-[state=active]:bg-white'}
              >
                경매 매물
              </TabsTrigger>
            </div>
          ) : (
            <div className={'grid w-full grid-cols-2 rounded-md bg-gray-100 p-1'}>
              <TabsTrigger value={'auction'} className={'flex-1 data-[state=active]:bg-white'}>
                경매 내역
              </TabsTrigger>
              <TabsTrigger
                value={'general-listings'}
                className={'flex-1 data-[state=active]:bg-white'}
              >
                일반 매물
              </TabsTrigger>
            </div>
          )}
        </TabsList>
        <TabsContent value={'auction'} className={'w-full'}>
          <Suspense
            fallback={<AuctionHistoryListSkeleton className={'mt-2 flex flex-col gap-2'} />}
          >
            <AuctionHistoryList className={'mt-2 flex flex-col gap-2'} />
          </Suspense>
        </TabsContent>
        <TabsContent value={'general-listings'} className={'w-full'}>
          일반 매물 입니다.
        </TabsContent>
        <TabsContent value={'auction-listings'} className={'w-full'}>
          경매 매물 입니다.
        </TabsContent>
      </Tabs>
    </div>
  )
}
