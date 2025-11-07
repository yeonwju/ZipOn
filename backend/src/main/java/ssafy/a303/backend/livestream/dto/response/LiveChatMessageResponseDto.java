package ssafy.a303.backend.livestream.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 라이브 방송 중 전달되는 채팅 메시지 응답 DTO
 * ------------------------------------------------------
 * 발신자 정보와 메시지를 포함하여 브로드캐스트.
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LiveChatMessageResponseDto {
    private Integer liveSeq;        // 방송 ID
    private Integer senderSeq;      // 발신자 ID
    private String senderName;  // 발신자 닉네임
    private String content;         // 채팅 내용
    private LocalDateTime sentAt;   // 전송 시각
}
