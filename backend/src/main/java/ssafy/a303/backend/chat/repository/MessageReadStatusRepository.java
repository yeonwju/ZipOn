package ssafy.a303.backend.chat.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ssafy.a303.backend.chat.entity.ChatRoom;
import ssafy.a303.backend.chat.entity.MessageReadStatus;
import ssafy.a303.backend.user.entity.User;

import java.util.List;

public interface MessageReadStatusRepository extends JpaRepository<MessageReadStatus, Integer> {

    /** 특정 방 + 사용자 기준으로 읽음 상태 전체 조회 */
    List<MessageReadStatus> findByChatRoomAndUser(ChatRoom room, User user);

    /** 아직 읽지 않은 메시지 개수 */
    long countByChatRoomAndUserAndIsReadFalse(ChatRoom room, User user);

    /** 아직 읽지 않은 메시지 개수 (ID 기반 조회) */
    long countByChatRoomIdAndUserUserSeqAndIsReadFalse(Integer roomId, Integer userSeq);
}
