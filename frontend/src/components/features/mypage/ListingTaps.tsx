import { Tabs, TabsList } from '@radix-ui/react-tabs'

import AuctionHistoryList from '@/components/features/mypage/autcion-history/AuctionHistoryList'
import { TabsContent, TabsTrigger } from '@/components/ui/tabs'

interface ListingTapsProps {
  className?: string
  isBroker: boolean
}

export default function ListingTaps({ className, isBroker }: ListingTapsProps) {
  const isBrokerUser = isBroker

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
          {/* Client Component가 내부에서 로딩 상태 관리 */}
          <AuctionHistoryList className={'mt-2 flex flex-col gap-2'} />
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
