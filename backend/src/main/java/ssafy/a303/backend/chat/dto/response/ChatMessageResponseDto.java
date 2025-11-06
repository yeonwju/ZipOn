package ssafy.a303.backend.chat.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 채팅 메시지 응답 DTO
 * ------------------------------------------------------
 * 메시지 전송 시 DB에 저장 후,
 * WebSocket 구독자들에게 전달되는 데이터 형식.
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessageResponseDto {
    private Integer messageSeq;      // chat_message.message_seq
    private Integer roomSeq;         // chat_message.room_seq
    private Integer senderSeq;       // chat_message.user_seq
    private String senderName;   // user.name
    private String content;          // chat_message.content
    private LocalDateTime sentAt;    // chat_message.sent_at
}