package ssafy.a303.backend.chat.entity;

import jakarta.persistence.*;
import lombok.*;
import ssafy.a303.backend.common.entity.BaseTimeEntity;
import ssafy.a303.backend.user.entity.User;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 채팅 메시지 (chat_message)
 * - ERD: message_seq(PK), room_seq(FK), user_seq(FK), content, sent_at
 */
@Entity
@Table(name = "chat_message")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessage extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "message_seq")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_seq", nullable = false)
    private ChatRoom chatRoom;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_seq", nullable = false)
    private User sender;

    @Column(nullable = false, length = 500)
    private String content;

    @Column(name = "sent_at", nullable = false)
    private LocalDateTime sentAt;

    /**
     * 읽음 상태 목록 (message_read_status)
     * - 메시지 삭제 시 읽음 상태도 함께 삭제
     */
    @OneToMany(mappedBy = "chatMessage", cascade = CascadeType.REMOVE)
    private List<MessageReadStatus> readStatuses = new ArrayList<>();
}
