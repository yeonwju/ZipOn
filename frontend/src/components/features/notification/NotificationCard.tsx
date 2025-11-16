import Image from 'next/image'

import { NotificationProps } from '@/types/models/notification'

export default function NotificationCard(props: NotificationProps) {
  const renderContent = () => {
    switch (props.type) {
      case 'CHAT':
        return (
          <>
            <div className="text-sm font-semibold">{props.senderName}</div>
            <div className="text-sm text-gray-700">{props.message}</div>
          </>
        )
      case 'LIVE':
        return (
          <>
            <div className="text-sm font-semibold">라이브 방송 10분 전</div>
            <div className="text-sm text-gray-700">{props.itemName} 방송이 곧 시작됩니다!</div>
          </>
        )
      case 'AUCTION_SOON':
        return (
          <>
            <div className="text-sm font-semibold">경매 마감 임박</div>
            <div className="text-sm text-gray-700">{props.itemName} 마감까지 10분 남았습니다.</div>
          </>
        )
      case 'AUCTION_WIN':
        return (
          <>
            <div className="text-sm font-semibold">🎉 낙찰을 축하합니다!</div>
            <div className="text-sm text-gray-700">{props.itemName}에 최종 낙찰되셨습니다.</div>
          </>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex w-full max-w-md items-center rounded-2xl bg-white p-4 shadow-md">
      <Image src={'/main-logo.svg'} alt="메인로고" width={40} height={40} />
      <div className="flex-1">{renderContent()}</div>
      <span className="ml-3 text-xs whitespace-nowrap text-gray-400">{props.time}</span>
    </div>
  )
}
