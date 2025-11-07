package ssafy.a303.backend.chat.entity;

import jakarta.persistence.*;
import lombok.*;
import ssafy.a303.backend.common.entity.BaseTimeEntity;
import ssafy.a303.backend.user.entity.User;

/**
 * 채팅 참여자 (chat_participant)
 * - ERD: participant_seq(PK), room_seq(FK), user_seq(FK)
 * - 1:1 방이라서 "참여자 2명"만 존재하도록 서비스/도메인 규칙으로 제한 권장
 */
@Entity
@Table(name = "chat_participant")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatParticipant extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "participant_seq")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_seq", nullable = false)
    private ChatRoom chatRoom;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_seq", nullable = false)
    private User user;
}

