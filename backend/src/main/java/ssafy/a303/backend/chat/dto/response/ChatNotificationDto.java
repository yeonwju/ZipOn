package ssafy.a303.backend.chat.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 채팅방 목록에서 실시간 알림을 위한 DTO
 * - 채팅방 목록 화면에서 구독하여 새 메시지 알림을 받음
 * - 마지막 메시지와 읽지 않은 개수를 실시간으로 업데이트
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatNotificationDto {

    /** 채팅방 ID */
    private Integer roomSeq;

    /** 메시지 발신자 정보 */
    private SenderDto sender;

    /** 메시지 내용 (목록에 표시용) */
    private String content;

    /** 메시지 전송 시각 */
    private LocalDateTime sentAt;

    /** 읽지 않은 메시지 개수 (수신자 기준) */
    private Integer unreadCount;

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SenderDto {
        private Integer userSeq;
        private String name;
        private String nickname;
        private String profileImg;
    }
}

