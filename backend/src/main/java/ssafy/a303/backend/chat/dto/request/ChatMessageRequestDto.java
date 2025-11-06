package ssafy.a303.backend.chat.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 채팅 메시지 전송 요청 DTO
 * ------------------------------------------------------
 * WebSocket(STOMP)을 통해 전송되는 메시지 형식.
 * JWT 인증 정보를 통해 발신자(user_seq)는 서버에서 확인함.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessageRequestDto {
    private Integer roomSeq;   // 채팅방 식별자 (chat_room.room_seq)
    private String content;    // 메시지 내용
}