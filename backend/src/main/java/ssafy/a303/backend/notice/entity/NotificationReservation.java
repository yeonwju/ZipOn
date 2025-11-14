package ssafy.a303.backend.notice.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import ssafy.a303.backend.auction.entity.Auction;
import ssafy.a303.backend.user.entity.User;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "noti_reservation",
        indexes = {
                @Index(name = "idx_nr_user_seq", columnList = "user_seq"),
                @Index(name = "idx_nr_auction_seq", columnList = "auction_seq"),
                @Index(name = "idx_nr_scheduled_at", columnList = "scheduled_at")
        }
)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationReservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reserveSeq;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_seq", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "auction_seq", nullable = false)
    private Auction auction;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private NotificationType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ReservationStatus status;

    @Column(nullable = false)
    private LocalDateTime scheduledAt;

    @Column
    private LocalDateTime sentAt;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
