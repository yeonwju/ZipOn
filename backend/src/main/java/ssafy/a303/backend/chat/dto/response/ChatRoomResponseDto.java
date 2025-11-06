package ssafy.a303.backend.chat.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
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

    @Schema(description = "채팅방 식별자", example = "1")
    private Integer roomSeq;

    @JsonProperty("isNew")
    @Schema(description = "신규 생성 여부", example = "true")
    private Boolean newRoom;

    @Schema(description = "상대방 정보")
    private OpponentDto opponent;

    @Getter  // 내부 클래스는 클래스 레벨에 @Getter 유지 (정상 동작)
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OpponentDto {

        @Schema(description = "상대방 사용자 식별자", example = "2")
        private Integer userSeq;

        @Schema(description = "상대방 이름", example = "홍길동")
        private String name;

        @Schema(description = "상대방 닉네임", example = "집주인")
        private String nickname;
    }
}
