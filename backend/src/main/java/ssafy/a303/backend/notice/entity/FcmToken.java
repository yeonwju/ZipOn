package ssafy.a303.backend.notice.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import ssafy.a303.backend.user.entity.User;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "fcm_token",
        indexes = {
                @Index(name = "uk_fcm_token", columnList = "token", unique = true),
                @Index(name = "idx_fcm_user_seq", columnList = "user_seq")
        }
)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FcmToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long tokenSeq;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_seq", nullable = false)
    private User user;

    @Column(nullable = false, length = 500)
    private String token;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
