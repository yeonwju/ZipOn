package ssafy.a303.backend.chat.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
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

    @Schema(description = "메시지 식별자", example = "1")
    private Integer messageSeq;      // chat_message.message_seq

    @Schema(description = "채팅방 식별자", example = "1")
    private Integer roomSeq;         // chat_message.room_seq

    @Schema(description = "발신자 사용자 식별자", example = "2")
    private Integer senderSeq;       // chat_message.user_seq

    @Schema(description = "발신자 이름", example = "홍길동")
    private String senderName;   // user.name

    @Schema(description = "메시지 내용", example = "안녕하세요")
    private String content;          // chat_message.content

    @Schema(description = "전송 시각", example = "2025-11-06T10:30:00")
    private LocalDateTime sentAt;    // chat_message.sent_at
}