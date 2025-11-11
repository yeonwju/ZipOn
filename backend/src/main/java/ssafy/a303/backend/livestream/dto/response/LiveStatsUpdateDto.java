package ssafy.a303.backend.livestream.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 라이브 방송 통계 업데이트 알림 DTO
 * - 라이브 목록 화면에서 실시간으로 통계를 업데이트하기 위한 DTO
 * - 시청자 수, 채팅 수, 좋아요 수 변경 시 발행
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LiveStatsUpdateDto {

    /** 라이브 방송 ID */
    private Integer liveSeq;

    /** 현재 시청자 수 */
    private Integer viewerCount;

    /** 현재 채팅 수 */
    private Integer chatCount;

    /** 현재 좋아요 수 */
    private Integer likeCount;

    /** 업데이트 타입 (VIEWER, CHAT, LIKE, ALL) */
    private UpdateType updateType;

    public enum UpdateType {
        VIEWER,   // 시청자 수 변경
        CHAT,     // 채팅 수 변경
        LIKE,     // 좋아요 수 변경
        ALL       // 전체 업데이트
    }
}

