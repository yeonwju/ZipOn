package ssafy.a303.backend.notice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ssafy.a303.backend.auction.entity.Auction;
import ssafy.a303.backend.notice.entity.NotificationReservation;
import ssafy.a303.backend.notice.entity.NotificationType;
import ssafy.a303.backend.notice.entity.ReservationStatus;
import ssafy.a303.backend.user.entity.User;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface NotificationReservationRepository
        extends JpaRepository<NotificationReservation, Long> {

    /** 특정 유저가 특정 경매에서
     특정 타입으로 예약한 알림 1개 찾기 */
    Optional<NotificationReservation> findByUserAndAuctionAndType(
            User user, Auction auction, NotificationType type
    );

    /** 발송해야 하는 알림 */
    List<NotificationReservation> findTop100ByStatusAndScheduledAtLessThanEqualOrderByScheduledAtAsc(
            ReservationStatus status,
            LocalDateTime now
    );
}
