/**
 * 내 채팅방 목록 조회
 */
export interface ChatRoomList {
  roomSeq : number,
  partnerSeq : number | null,
  partnerName : string | null,
  lastMessage : string | null,
  lastSentAt : string ,
  unreadCount : number ,
  profileImgSrc : string | null,
}

/**
 * 채팅방 메시지 기록 조회
 */
export interface ChatHistory {
  messageSeq : number,
  roomSeq : number,
  senderSeq : number,
  senderName : string,
  content : string,
  sentAt : string,
}