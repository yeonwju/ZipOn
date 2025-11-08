/**
 * 내 채팅방 목록 조회
 */
export interface ChatRoomList {
  roomSeq : number,
  partnerSeq : number | null,
  partnerName : string | null,
  lastMessage : string,
  lastSentAt : string,
  unreadCount : number | null,
}