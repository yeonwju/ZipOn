package ssafy.a303.backend.notice.service;

import com.google.firebase.messaging.FirebaseMessagingException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import ssafy.a303.backend.notice.entity.*;
import ssafy.a303.backend.notice.repository.FcmTokenRepository;
import ssafy.a303.backend.notice.repository.NotificationHistoryRepository;
import ssafy.a303.backend.notice.repository.NotificationReservationRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationScheduler {

    private final NotificationReservationRepository reservationRepo;
    private final FcmTokenRepository fcmTokenRepo;
    private final NotificationHistoryRepository historyRepo;
    private final FcmService fcmService;   // 너가 테스트용으로 만든 FcmService 재사용

    /**
     * 1분마다 예약된 알림을 확인해서 발송
     */
    @Scheduled(cron = "0 * * * * *")
    @Transactional
    public void sendDueNotifications() {
        LocalDateTime now = LocalDateTime.now();

        // 1) 지금 발송해야 할 예약 목록 조회 (최대 100개)
        List<NotificationReservation> reservations =
                reservationRepo.findTop100ByStatusAndScheduledAtLessThanEqualOrderByScheduledAtAsc(
                        ReservationStatus.PENDING, now
                );

        if (reservations.isEmpty()) {
            return;
        }

        log.info("📨 예약된 알림 {}건 발송 시도", reservations.size());

        for (NotificationReservation reservation : reservations) {
            try {
                processReservation(reservation);
            } catch (Exception e) {
                log.error("⚠️ 알림 발송 중 오류 - reservationSeq={}", reservation.getReserveSeq(), e);
                reservation.setStatus(ReservationStatus.EXPIRED);
            }
        }
    }

    private void processReservation(NotificationReservation reservation) throws FirebaseMessagingException {
        var user = reservation.getUser();

        // 1) 유저의 최신 FCM 토큰 조회
        Optional<FcmToken> tokenOpt = fcmTokenRepo.findTopByUserOrderByCreatedAtDesc(user);
        if (tokenOpt.isEmpty()) {
            log.warn("⚠️ FCM 토큰 없음 - userSeq={}", user.getUserSeq());
            reservation.setStatus(ReservationStatus.EXPIRED);
            return;
        }

        String token = tokenOpt.get().getToken();

        // 2) 알림 title / body / 링크 구성
        NotificationPayload payload = buildPayload(reservation);

        // 3) FCM 발송
        fcmService.sentMessageTo(token, payload.title(), payload.body());
        log.info("✅ FCM 발송 성공 - userSeq={}, type={}, reserveSeq={}",
                user.getUserSeq(), reservation.getType(), reservation.getReserveSeq());

        // 4) Reservation 상태 업데이트
        reservation.setStatus(ReservationStatus.SENT);
        reservation.setSentAt(LocalDateTime.now());

        // 5) NotificationHistory 저장 (알림함)
        NotificationHistory history = NotificationHistory.builder()
                .user(user)
                .type(reservation.getType())
                .title(payload.title())
                .content(payload.body())
                .linkUrl(payload.linkUrl())
                .targetType(payload.targetType())
                .targetId(payload.targetId())
                .read(false)
                .build();

        historyRepo.save(history);
    }

    /**
     * 알림 타입에 따라 title / body / 링크 구성
     */
    private NotificationPayload buildPayload(NotificationReservation reservation) {

        NotificationType type = reservation.getType();
        var auction = reservation.getAuction();

        String title;
        String body;
        String linkUrl = null;
        NotificationTarget targetType = NotificationTarget.AUCTION;
        Long targetId = auction.getAuctionSeq().longValue();

        switch (type) {
            case LIVE_BEFORE_10 -> {
                title = "라이브 방송 10분 전입니다!";
                body = String.format("'%s' 방송이 곧 시작됩니다. 입장을 준비해주세요!",
                        auction.getProperty().getPropertyNm());
                linkUrl = "/auction/" + auction.getAuctionSeq();
            }
            case AUCTION_CLOSE_BEFORE_10 -> {
                title = "경매 마감 10분 전!";
                body = String.format("'%s' 경매가 10분 후에 마감됩니다. 입찰을 서둘러주세요!",
                        auction.getProperty().getPropertyNm());
                linkUrl = "/auction/" + auction.getAuctionSeq();
            }
            case AUCTION_WINNER -> {
                title = "경매에 낙찰되셨습니다!";
                body = String.format("'%s' 경매에 낙찰되셨습니다. 상세 내용을 확인해 주세요.",
                        auction.getProperty().getPropertyNm());
                linkUrl = "/auction/" + auction.getAuctionSeq();
            }
            default -> {
                title = "ZIPON 알림";
                body = "새로운 알림이 도착했습니다.";
                linkUrl = "/notifications";
            }
        }

        return new NotificationPayload(title, body, linkUrl, targetType, targetId);
    }

    /**
     * 내부에서 쓸 알림 payload 정의용 record
     */
    private record NotificationPayload(
            String title,
            String body,
            String linkUrl,
            NotificationTarget targetType,
            Long targetId
    ) {}
}
