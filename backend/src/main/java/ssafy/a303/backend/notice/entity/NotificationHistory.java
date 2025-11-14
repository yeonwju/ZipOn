package ssafy.a303.backend.notice.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import ssafy.a303.backend.user.entity.User;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "notification_history",
        indexes = {
                @Index(name = "idx_nh_user_seq", columnList = "user_seq"),
                @Index(name = "idx_nh_is_read", columnList = "is_read"),
                @Index(name = "idx_nh_created_at", columnList = "created_at")
        }
)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long historySeq;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_seq", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private NotificationType type;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, length = 500)
    private String content;

    @Column
    private String linkUrl;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private NotificationTarget targetType;

    @Column
    private Long targetId;

    @Column(nullable = false)
    private boolean isRead;

    @Column
    private LocalDateTime readAt;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
