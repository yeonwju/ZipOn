package ssafy.a303.backend.chat.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 내 채팅방 목록 조회 응답 DTO
 * ------------------------------------------------------
 * 로그인한 사용자가 포함된 모든 1:1 채팅방의 요약 정보를 담는다.
 * - 상대방 정보
 * - 최근 메시지 및 보낸 시각
 * - 읽지 않은 메시지 개수
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MyChatListResponseDto {

    @Schema(description = "채팅방 식별자", example = "1")
    private Integer roomSeq;            // chat_room.room_seq

    @Schema(description = "상대방 사용자 식별자", example = "2")
    private Integer partnerSeq;         // 상대방 user_seq

    @Schema(description = "상대방 이름", example = "홍길동")
    private String partnerName;         // 상대방 이름 (user.name)

    @Schema(description = "최근 메시지 내용", example = "안녕하세요")
    private String lastMessage;         // 최근 메시지 내용

    @Schema(description = "최근 메시지 전송 시각", example = "2025-11-06T10:30:00")
    private LocalDateTime lastSentAt;   // 최근 메시지 시각

    @Schema(description = "읽지 않은 메시지 개수", example = "3")
    private Integer unreadCount;        // 읽지 않은 메시지 개수

}
