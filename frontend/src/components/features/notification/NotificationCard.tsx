import { NotificationProps } from "@/types/models/notification";
import Image from "next/image";

export default function NotificationCard(props: NotificationProps) {
  const renderContent = () => {
    switch (props.type) {
      case "CHAT":
        return (
          <>
            <div className="font-semibold text-sm">{props.senderName}</div>
            <div className="text-gray-700 text-sm">{props.message}</div>
          </>
        );
      case "LIVE":
        return (
          <>
            <div className="font-semibold text-sm">라이브 방송 10분 전</div>
            <div className="text-gray-700 text-sm">
              {props.itemName} 방송이 곧 시작됩니다!
            </div>
          </>
        );
      case "AUCTION_SOON":
        return (
          <>
            <div className="font-semibold text-sm">경매 마감 임박</div>
            <div className="text-gray-700 text-sm">
              {props.itemName} 마감까지 10분 남았습니다.
            </div>
          </>
        );
      case "AUCTION_WIN":
        return (
          <>
            <div className="font-semibold text-sm">🎉 낙찰을 축하합니다!</div>
            <div className="text-gray-700 text-sm">
              {props.itemName}에 최종 낙찰되셨습니다.
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center bg-white shadow-md rounded-2xl p-4 w-full max-w-md">
        <Image src={'/main-logo.svg'} alt="메인로고" width={40} height={40}/>
      <div className="flex-1">{renderContent()}</div>
      <span className="text-xs text-gray-400 ml-3 whitespace-nowrap">
        {props.time}
      </span>
    </div>
  );
}