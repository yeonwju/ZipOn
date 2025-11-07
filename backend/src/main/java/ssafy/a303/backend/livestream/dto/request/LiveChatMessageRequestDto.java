package ssafy.a303.backend.livestream.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 라이브 방송 중 채팅 메시지 전송 요청 DTO
 * ------------------------------------------------------
 * 시청자가 WebSocket(STOMP)을 통해 메시지를 전송할 때 사용.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LiveChatMessageRequestDto {
    private Integer liveSeq;     // 방송 ID (live_stream.live_seq)
    private String content;      // 채팅 내용
}
