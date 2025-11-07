package ssafy.a303.backend.livestream.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import ssafy.a303.backend.livestream.enums.LiveStreamStatus;

import java.time.LocalDateTime;

/**
 * 라이브 방송 시작 응답 DTO
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LiveCreateResponseDto {

    @Schema(description = "방송 식별자", example = "1")
    private Integer liveSeq;

    @Schema(description = "OpenVidu Session ID")
    private String sessionId;

    @Schema(description = "방송 제목")
    private String title;

    @Schema(description = "방송 상태", example = "LIVE")
    private LiveStreamStatus status;

    @Schema(description = "방장 정보")
    private HostDto host;

    @Schema(description = "시작 시간")
    private LocalDateTime startAt;

    @Getter
    @Builder
    public static class HostDto {
        @Schema(description = "사용자 식별자", example = "1")
        private Integer userSeq;

        @Schema(description = "이름", example = "홍길동")
        private String name;

        @Schema(description = "프로필 이미지 URL", example = "https://s3.../profile.png")
        private String profileImg;
    }

}
