package ssafy.a303.backend.livestream.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import ssafy.a303.backend.livestream.enums.LiveStreamStatus;

import java.time.LocalDateTime;

/**
 * 새 라이브 방송 시작 알림 DTO
 * - 라이브 목록 화면에서 새 방송을 실시간으로 추가하기 위한 DTO
 * - LiveInfoResponseDto와 거의 동일하지만 알림 전용으로 분리
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LiveStartNotificationDto {

    /** 라이브 방송 ID */
    private Integer liveSeq;

    /** 경매 ID */
    private Integer auctionSeq;

    /** OpenVidu Session ID */
    private String sessionId;

    /** 방송 제목 */
    private String title;

    /** 방송 상태 */
    private LiveStreamStatus status;

    /** 호스트 정보 */
    private HostDto host;

    /** 방송 시작 시각 */
    private LocalDateTime startAt;

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class HostDto {
        private Integer userSeq;
        private String name;
        private String profileImg;
    }
}

