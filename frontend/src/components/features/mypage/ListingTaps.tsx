import { Tabs, TabsList } from '@radix-ui/react-tabs'

import { TabsContent, TabsTrigger } from '@/components/ui/tabs'
import { useUserStore } from '@/store/user'

export default function ListingTaps() {
  const { user } = useUserStore.getState()
  return (
    <>
      <Tabs
        defaultValue={'auction'}
        className={'mt-2 flex w-full flex-col items-center justify-center'}
      >
        <TabsList className={'w-full'}>
          {user?.isBroker ? (
            <div className={'grid w-full grid-cols-3 rounded-md bg-[#F2F8FC] p-1'}>
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
            <div className={'flex w-full flex-row'}>
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
        <TabsContent value={'auction'}>경매 내역 입니다.</TabsContent>
        <TabsContent value={'general-listings'}>일반 매물 입니다.</TabsContent>
        <TabsContent value={'auction-listings'}>경매 매물 입니다.</TabsContent>
      </Tabs>
    </>
  )
}
