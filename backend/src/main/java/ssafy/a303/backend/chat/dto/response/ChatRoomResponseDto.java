package ssafy.a303.backend.chat.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 채팅방 생성 응답 DTO
 * ------------------------------------------------------
 * 신규 생성 또는 기존 채팅방 조회 시 반환되는 정보.
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatRoomResponseDto {
    private Integer roomSeq;
    private boolean isNew;
    private OpponentDto opponent;

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OpponentDto {
        private Integer userSeq;
        private String name;
        private String nickname;
    }
}
