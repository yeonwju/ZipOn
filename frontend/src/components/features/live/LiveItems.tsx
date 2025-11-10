import { LiveItem } from '@/components/features/live'
import { LiveItemProps } from '@/data/LiveItemDummy'

export interface LiveItemsProps {
  items: LiveItemProps[]
}

export default function LiveItems({ items }: LiveItemsProps) {
  return (
    <div className={'grid w-full grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}>
      {items.map(item => (
        <div key={item.id} className="w-full">
          <LiveItem
            id={item.id}
            imgSrc={item.imgSrc}
            title={item.title}
            viewCnt={item.viewCnt}
            chatCnt={item.chatCnt}
            brokerName={item.brokerName}
            brokerImgSrc={item.brokerImgSrc}
          ></LiveItem>
        </div>
      ))}
    </div>
  )
}
