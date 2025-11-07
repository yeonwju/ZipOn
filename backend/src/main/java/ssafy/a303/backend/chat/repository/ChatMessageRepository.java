package ssafy.a303.backend.chat.repository;

import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ssafy.a303.backend.chat.entity.ChatMessage;
import ssafy.a303.backend.chat.entity.ChatRoom;
import ssafy.a303.backend.user.entity.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Integer> {

    /** 특정 채팅방의 메시지를 시간순으로 정렬해 조회 */
    List<ChatMessage> findByChatRoomOrderBySentAtAsc(ChatRoom chatRoom);

    /** 특정 채팅방의 가장 최근 메시지 조회 */
    Optional<ChatMessage> findTopByChatRoomOrderBySentAtDesc(ChatRoom chatRoom);

}
