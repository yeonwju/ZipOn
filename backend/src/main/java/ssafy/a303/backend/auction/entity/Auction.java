package ssafy.a303.backend.auction.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import ssafy.a303.backend.property.entity.Property;
import ssafy.a303.backend.user.entity.User;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(
        name = "auction",
        indexes = {
                @Index(name = "idx_auction_strm_date_start", columnList = "strm_date, strm_start_tm"),
                @Index(name = "idx_auction_auction_end_at", columnList = "auction_end_at")
        })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Auction {
    // 신청
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer auctionSeq;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_seq", nullable = false)
    private User user; // 경매를 방송할 중개인 또는 임대인 user

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_seq", nullable = false)
    private Property property;

    @Column
    private String intro;

    @Column
    private LocalDate strmDate;

    @Column
    private LocalTime strmStartTm;

    @Column
    private LocalTime strmEndTm;

    @Column
    private LocalDateTime auctionStartAt;

    @Column
    private LocalDateTime auctionEndAt;

    // 상태
    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private AuctionStatus status = AuctionStatus.REQUESTED;

    @Builder.Default
    @Column
    private boolean finish = false; // status 가 ACCEPTED 일 때, 경매 자동 시작 등록하기 위해 사용

    // 취소
    @Column
    private LocalDateTime cancelAt;

    @Enumerated(EnumType.STRING)
    @Column
    private AuctionCancler cancelBy;

    @Column
    private String cancelReason;

    @Column
    @CreationTimestamp
    private LocalDateTime createdAt;

}
