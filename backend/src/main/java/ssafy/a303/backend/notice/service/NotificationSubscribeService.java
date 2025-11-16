package ssafy.a303.backend.notice.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ssafy.a303.backend.auction.entity.Auction;
import ssafy.a303.backend.auction.repository.AuctionAlarmRepository;
import ssafy.a303.backend.auction.service.AuctionAlarmService;
import ssafy.a303.backend.auction.repository.AuctionRepository;
import ssafy.a303.backend.notice.entity.NotificationReservation;
import ssafy.a303.backend.notice.entity.NotificationType;
import ssafy.a303.backend.notice.entity.ReservationStatus;
import ssafy.a303.backend.notice.repository.NotificationReservationRepository;
import ssafy.a303.backend.user.entity.User;
import ssafy.a303.backend.user.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationSubscribeService {

    private final AuctionAlarmService auctionAlarmService;
    private final NotificationReservationRepository reservationRepo;
    private final AuctionRepository auctionRepository;
    private final AuctionAlarmRepository auctionAlarmRepository;
    private final UserRepository userRepository;

    @PersistenceContext
    private EntityManager em;

    /**
     * 알림 켬 (subscribe)
     */
    public void subscribe(int userSeq, int auctionSeq) {

        auctionAlarmService.save(userSeq, auctionSeq);

        User user = userRepository.getReferenceById(userSeq);
        Auction auction = auctionRepository.findById(auctionSeq)
                .orElseThrow(() -> new RuntimeException("경매 없음"));

        // 예약 시간 계산
        LocalDateTime liveAt = LocalDateTime.of(
                auction.getStrmDate(),
                auction.getStrmStartTm()
        ).minusMinutes(10);

        LocalDateTime closeAt = auction.getAuctionEndAt().minusMinutes(10);

        // 예약 생성/갱신
        upsertReservation(user, auction, NotificationType.LIVE_BEFORE_10, liveAt);
        upsertReservation(user, auction, NotificationType.AUCTION_CLOSE_BEFORE_10, closeAt);
    }


    /**
     * 예약 생성/갱신 (중복 생성 방지)
     */
    private void upsertReservation(
            User user,
            Auction auction,
            NotificationType type,
            LocalDateTime scheduledAt
    ) {
        reservationRepo.findByUserAndAuctionAndType(user, auction, type)
                .ifPresentOrElse(
                        existing -> {
                            existing.setStatus(ReservationStatus.PENDING);
                            existing.setScheduledAt(scheduledAt);
                            existing.setSentAt(null);
                        },
                        () -> {
                            NotificationReservation newOne = NotificationReservation.builder()
                                    .user(user)
                                    .auction(auction)
                                    .type(type)
                                    .status(ReservationStatus.PENDING)
                                    .scheduledAt(scheduledAt)
                                    .build();
                            reservationRepo.save(newOne);
                        }
                );
    }


    /**
     * 알림 끔 (unsubscribe)
     */
    public void unsubscribe(int userSeq, int auctionSeq) {

        int deleted = em.createQuery("""
                    delete from AuctionAlarm aa
                    where aa.user.userSeq = :userSeq
                    and aa.auction.auctionSeq = :auctionSeq
                """)
                .setParameter("userSeq", userSeq)
                .setParameter("auctionSeq", auctionSeq)
                .executeUpdate();

        if (deleted == 0) {
            throw new RuntimeException("알림받기 상태가 존재하지 않음");
        }

        User user = userRepository.getReferenceById(userSeq);
        Auction auction = auctionRepository.findById(auctionSeq)
                .orElseThrow(() -> new RuntimeException("경매 없음"));

        List<NotificationType> types = List.of(
                NotificationType.LIVE_BEFORE_10,
                NotificationType.AUCTION_CLOSE_BEFORE_10
        );

        types.forEach(type ->
                reservationRepo.findByUserAndAuctionAndType(user, auction, type)
                        .ifPresent(res -> res.setStatus(ReservationStatus.CANCELED))
        );
    }

    public boolean isSubscribed(int userSeq, int auctionSeq) {
        return auctionAlarmRepository
                .existsByUser_UserSeqAndAuction_AuctionSeq(userSeq, auctionSeq);
    }


}
