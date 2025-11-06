package ssafy.a303.backend.chat.repository;

import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ssafy.a303.backend.chat.entity.ChatParticipant;
import ssafy.a303.backend.chat.entity.ChatRoom;
import ssafy.a303.backend.user.entity.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatParticipantRepository extends JpaRepository<ChatParticipant, Integer> {

    /** 현재 사용자가 속한 모든 채팅방 반환 */
    List<ChatParticipant> findAllByUser(User user);

    /** 방과 사용자로 존재 여부 확인 (접근권한 검증용) */
    boolean existsByChatRoomAndUser(ChatRoom chatRoom, User user);

    /** 특정 채팅방의 모든 참여자 반환 */
    List<ChatParticipant> findAllByChatRoom(ChatRoom chatRoom);

    /** 특정 채팅방에 현재 로그인한 사용자가 참여하고 있는 이력 반환*/
    Optional<ChatParticipant> findByChatRoomAndUser(ChatRoom chatRoom, User user);

    /**
     * 1:1 채팅 존재 여부 확인
     * 두 유저가 동시에 포함된 동일한 방이 존재하면 그 방 반환
     */
    @Query("""
        SELECT cp.chatRoom
        FROM ChatParticipant cp
        WHERE cp.user.userSeq IN (:userSeq1, :userSeq2)
        GROUP BY cp.chatRoom
        HAVING COUNT(DISTINCT cp.user.userSeq) = 2
        """)
    Optional<ChatRoom> findExistingPrivateRoom(@Param("userSeq1") Integer userSeq1,
                                               @Param("userSeq2") Integer userSeq2);

}
