package ssafy.a303.backend.chat.entity;

import jakarta.persistence.*;
import lombok.*;
import ssafy.a303.backend.common.entity.BaseTimeEntity;
import ssafy.a303.backend.property.entity.Property;

import java.util.ArrayList;
import java.util.List;

/**
 * 채팅방 (chat_room)
 * - ERD: room_seq(PK), name
 * - 1:1 채팅 방이지만, ERD에는 제약(UNIQUE 2인만)은 없음 → 서비스 레벨에서 1:1만 생성하도록 보장
 */
@Entity
@Table(name = "chat_room")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatRoom extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "room_seq")
    private Integer id;

    /** property FK → property.property_seq (매물과 연결) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_seq", nullable = false)
    private Property property;

    /** 참여자 조합으로 이름 생성 */
    @Column(nullable = false, length = 100)
    private String name;

    /**
     * 참여자 목록 (chat_participant)
     * - ERD: N:1 (participant -> room)
     * - CascadeType.REMOVE: 방 삭제 시 참여자 레코드도 함께 삭제
     * - orphanRemoval=false: 다른 곳에서 직접 제거할 케이스가 드묾
     */
    @OneToMany(mappedBy = "chatRoom", cascade = CascadeType.REMOVE)
    @Builder.Default
    private List<ChatParticipant> participants = new ArrayList<>();

    /**
     * 메시지 목록 (chat_message)
     * - ERD: N:1 (message -> room)
     * - CascadeType.REMOVE: 방 삭제 시 메시지도 함께 삭제
     */
    @OneToMany(mappedBy = "chatRoom", cascade = CascadeType.REMOVE)
    @Builder.Default
    private List<ChatMessage> messages = new ArrayList<>();
}
