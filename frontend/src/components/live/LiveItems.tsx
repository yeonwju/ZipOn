import LiveItem from '@/components/live/LiveItem'
import { LiveItemProps } from '@/data/LiveItem'

export interface LiveItemsProps {
  items: LiveItemProps[]
}

export default function LiveItems({ items }: LiveItemsProps) {
  return (
    <div>
      {items.map(item => (
        <div key={item.id}>
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
