package ssafy.a303.backend.auction.entity;

import jakarta.persistence.*;
import lombok.*;
import ssafy.a303.backend.user.entity.User;

import java.time.LocalDateTime;

@Entity
@Table(name = "bid")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bid {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer bidSeq;
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
    private Integer rank;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BidStatus status;
    @Column
    private LocalDateTime decidedAt;
}
