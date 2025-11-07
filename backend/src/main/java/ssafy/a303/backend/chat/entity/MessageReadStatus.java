package ssafy.a303.backend.chat.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import ssafy.a303.backend.common.entity.BaseTimeEntity;
import ssafy.a303.backend.user.entity.User;

/**
 * 메시지 읽음 상태 (message_read_status)
 * - ERD: read_seq(PK), message_seq(FK), user_seq(FK), room_seq(FK), is_read
 * - 조회 최적화를 위해 room_seq도 함께 보유(ERD 기준)
 */
@Entity
@Table(name = "message_read_status")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageReadStatus extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "read_seq")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "message_seq", nullable = false)
    private ChatMessage chatMessage;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_seq", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_seq", nullable = false)
    private ChatRoom chatRoom;

    @Column(name = "is_read", nullable = false)
    @ColumnDefault("false")
    @Builder.Default
    private Boolean isRead = false;

    public boolean isRead() {
        return Boolean.TRUE.equals(this.isRead);
    }

    /** 읽음 처리 도메인 메서드 */
    public void markRead() {
        this.isRead = Boolean.TRUE; // JPA 변경 감지 대상
    }
}
