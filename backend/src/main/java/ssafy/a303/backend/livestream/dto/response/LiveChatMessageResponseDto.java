package ssafy.a303.backend.livestream.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
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
    @Schema(description = "라이브 방송 식별자", example = "12")
    private Integer liveSeq;

    @Schema(description = "메시지를 보낸 사용자 식별자", example = "101")
    private Integer senderSeq;

    @Schema(description = "발신자 이름", example = "홍길동")
    private String senderName;

    @Schema(description = "전송된 채팅 메시지", example = "이 집 구조 좋아보이네요!")
    private String content;

    @Schema(description = "서버 기준 메시지 전송 시간", example = "2025-11-07T10:45:22")
    private LocalDateTime sentAt;
}
