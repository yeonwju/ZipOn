package ssafy.a303.backend.auction.entity;

import jakarta.persistence.*;
import lombok.*;
import ssafy.a303.backend.user.entity.User;

import java.time.LocalDateTime;

@Entity
@Table(name = "attendance")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Attendance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer attendanceSeq;
    @ManyToOne
    @JoinColumn(name = "user_seq", nullable = false)
    private User user;
    @ManyToOne
    @JoinColumn(name = "auction_seq", nullable = false)
    private Auction auction;
    @Column(nullable = false)
    private LocalDateTime bidAt;
    @Column(nullable = false)
    private int bidAmount;
    @Column
    private int rank;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private AttendanceStatus status = AttendanceStatus.WAITING;
    @Column
    private LocalDateTime decidedAt;
}
