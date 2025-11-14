package ssafy.a303.backend.livestream.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 라이브 방송 참여 토큰 발급 응답 DTO
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LiveTokenResponseDto {

    @Schema(description = "OpenVidu 연결 토큰")
    private String token;

    @Schema(description = "OpenVidu Session ID")
    private String sessionId;

    @Schema(description = "참여자 역할", example = "PUBLISHER")
    private String role;

}
