package ssafy.a303.backend.auction.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import ssafy.a303.backend.property.entity.Property;
import ssafy.a303.backend.user.entity.User;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "auction")
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
    @JoinColumn(name = "user_seq")
    private User user; // 경매를 방송할 중개인 또는 임대인 user
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_seq")
    private Property property;
    @Column(nullable = false)
    private LocalDate strmDate;
    @Column(nullable = false)
    private LocalTime strmStartTm;
    @Column(nullable = false)
    private LocalTime strmEndTm;
    @Column(nullable = false)
    private LocalDateTime auctionEndAt;

    // 상태
    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private AuctionStatus status = AuctionStatus.REQUESTED;

    // 취소
    @Column
    private LocalDateTime cancelAt;
    @Enumerated(EnumType.STRING)
    @Column
    private Canceler cancelBy;
    @Column
    private String cancelReason;

    @Column
    @CreationTimestamp
    private LocalDateTime createdAt;

}
