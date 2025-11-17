import Link from 'next/link'

import { LiveItem } from '@/components/features/live'
import { LiveListData } from '@/types/api/live'

export interface LiveItemsProps {
  items: LiveListData[]
}

export default function LiveItems({ items }: LiveItemsProps) {
  return (
    <div
      className={'grid w-full grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}
    >
      {items.map(item => (
        <div key={item.liveSeq} className="w-full">
          <Link href={`/live/onair/${item.liveSeq}`}>
            <LiveItem
              id={item.liveSeq}
              imgSrc={item.thumbnail}
              title={item.title}
              viewCnt={item.viewerCount}
              chatCnt={item.chatCount}
              brokerName={item.host.name}
              brokerImgSrc={item.host.profileImg}
            />
          </Link>
        </div>
      ))}
    </div>
  )
}
