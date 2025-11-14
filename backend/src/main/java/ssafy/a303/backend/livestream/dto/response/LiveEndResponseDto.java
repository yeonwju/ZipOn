package ssafy.a303.backend.livestream.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import ssafy.a303.backend.livestream.enums.LiveStreamStatus;

import java.time.LocalDateTime;

/**
 * 라이브 방송 종료 응답 DTO
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LiveEndResponseDto {

    @Schema(description = "방송 식별자", example = "1")
    private Integer liveSeq;

    @Schema(description = "경매 식별자", example = "1")
    private Integer auctionSeq;

    @Schema(description = "OpenVidu Session ID")
    private String sessionId;

    @Schema(description = "방송 제목")
    private String title;

    @Schema(description = "방송 대표사진")
    private String thumbnail;

    @Schema(description = "방송 상태", example = "ENDED")
    private LiveStreamStatus status;

    @Schema(description = "누적 시청자 수", example = "124")
    private Integer viewerCount;

    @Schema(description = "누적 채팅 메시지 수", example = "58")
    private Integer chatCount;

    @Schema(description = "받은 좋아요 수", example = "31")
    private Integer likeCount;

    @Schema(description = "방장 정보")
    private HostDto host;

    @Schema(description = "시작 시간")
    private LocalDateTime startAt;

    @Schema(description = "종료 시간")
    private LocalDateTime endAt;

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
