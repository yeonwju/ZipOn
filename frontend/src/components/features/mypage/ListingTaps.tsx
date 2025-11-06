import { Tabs, TabsList } from '@radix-ui/react-tabs'

import AuctionHistoryList from '@/components/features/mypage/autcion-history/AuctionHistoryList'
import { TabsContent, TabsTrigger } from '@/components/ui/tabs'
import { useUserStore } from '@/store/user'
import { LockKeyhole } from 'lucide-react'
import MyListingList from '@/components/features/mypage/my-listings/MyListingList'

interface ListingTapsProps {
  className?: string
}

export default function ListingTaps({ className }: ListingTapsProps) {
  const user = useUserStore(state => state.user)
  const isBrokerUser = user?.isBroker
  const isVerified = user?.isVerified

  return (
    <div className={className}>
      <Tabs defaultValue={'auction'} className={'flex w-full flex-col'}>
        <TabsList className={'w-full'}>
          <div className={'grid w-full grid-cols-2 rounded-md bg-gray-100 p-1'}>
            <TabsTrigger value={'auction'} className={'flex-1 data-[state=active]:bg-white'}>
              경매 참여 내역
            </TabsTrigger>
            <TabsTrigger value={'listings'} className={'flex-1 data-[state=active]:bg-white'}>
              내 매물 목록
            </TabsTrigger>
          </div>
        </TabsList>
        <TabsContent value={'auction'} className={'w-full'}>
          {/* Client Component가 내부에서 로딩 상태 관리 */}
          <AuctionHistoryList className={'mt-2 flex flex-col gap-2'} />
        </TabsContent>
        <TabsContent value={'listings'} className="w-full">
          {isVerified && isBrokerUser ? (
            <MyListingList className={'mt-2 flex flex-col gap-2'} />
          ) : (
            <div className="mt-2 flex flex-col items-center justify-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-9 text-center">
              <LockKeyhole size={40} className="text-gray-400" />
              <p className="text-base font-medium">접근 권한이 없습니다</p>
              <p className="text-sm text-gray-400">
                중개인 인증, 휴대폰 인증을 완료하시면 매물 등록 및 관리 기능을 이용하실 수 있습니다.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
