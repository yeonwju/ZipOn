package ssafy.a303.backend.livestream.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

/**
 * 라이브 방송 중 채팅 메시지 전송 요청 DTO
 * ------------------------------------------------------
 * 시청자가 WebSocket(STOMP)을 통해 메시지를 전송할 때 사용.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LiveChatMessageRequestDto {
    @Schema(description = "채팅 내용", example = "이 집 구조 좋아보이네요!")
    @NotBlank(message = "채팅 내용은 비어있을 수 없습니다.")
    @Size(max = 200, message = "채팅 내용은 최대 200자까지 가능합니다.")
    private String content;
}
