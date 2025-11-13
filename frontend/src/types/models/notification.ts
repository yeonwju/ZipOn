export type  NotificationType = 'CHAT' | 'LIVE' | 'AUCTION_SOON'| 'AUCTION_WIN'

type ChatNotification = {
  type: "CHAT";
  senderName: string;
  message: string;
  time: string;
};

type LiveNotification = {
  type: "LIVE";
  itemName: string;
  time: string;
};

type AuctionSoonNotification = {
  type: "AUCTION_SOON";
  itemName: string;
  time: string;
};

type AuctionWinNotification = {
  type: "AUCTION_WIN";
  itemName: string;
  time: string;
};

export type NotificationProps =
  | ChatNotification
  | LiveNotification
  | AuctionSoonNotification
  | AuctionWinNotification;