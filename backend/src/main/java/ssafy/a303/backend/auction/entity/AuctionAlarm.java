package ssafy.a303.backend.auction.entity;

import jakarta.persistence.*;
import ssafy.a303.backend.user.entity.User;

@Entity
@Table(
        name = "auction_alarm",
        indexes = {
                @Index(name = "idx_auction_alarm_user_seq", columnList = "user_seq"),
                @Index(name = "idx_auction_alarm_auction_seq", columnList = "auction_seq"),
                @Index(name = "uk_auction_alarm_auction_user", columnList = "auction_seq, user_seq", unique = true),
                @Index(name = "idx_aa_user_seq_alarm_seq", columnList = "user_seq, auction_alarm_seq")
        }
)

public class AuctionAlarm {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long auctionAlarmSeq;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "auction_seq", nullable = false)
    private Auction auction;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_seq", nullable = false)
    private User user;
    @Column
    private boolean read;
}
