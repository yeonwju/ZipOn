package ssafy.a303.backend.chat.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 채팅 메시지 응답 DTO
 * ------------------------------------------------------
 * 메시지 전송 시 DB에 저장 후,
 * WebSocket 구독자들에게 전달되는 데이터 형식.
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessageResponseDto {

    @Schema(description = "메시지 식별자", example = "1")
    private Integer messageSeq;

    @Schema(description = "채팅방 식별자", example = "1")
    private Integer roomSeq;

    @Schema(description = "발신자 정보")
    private SenderDto sender;

    @Schema(description = "메시지 내용", example = "안녕하세요")
    private String content;

    @Schema(description = "전송 시각", example = "2025-11-06T10:30:00")
    private LocalDateTime sentAt;

    /**
     * 발신자 정보 DTO
     * ------------------------------------------------------
     * 기존에는 senderSeq / senderName 이 분리되어 전달되었으나,
     * FE 렌더링은 보통 "sender 객체" 단위로 처리하므로 하나로 묶어서 관리.
     */
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SenderDto {

        @Schema(description = "발신자 사용자 식별자", example = "2")
        private Integer userSeq;

        @Schema(description = "발신자 이름", example = "홍길동")
        private String name;

        @Schema(description = "발신자 닉네임", example = "도현집ON")
        private String nickname;

        @Schema(description = "프로필 이미지 URL", example = "https://s3.../profile.jpg")
        private String profileImg;
    }
}