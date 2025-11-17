package ssafy.a303.backend.auction.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import ssafy.a303.backend.auction.entity.Auction;
import ssafy.a303.backend.auction.entity.Bid;
import ssafy.a303.backend.auction.entity.BidStatus;
import ssafy.a303.backend.auction.repository.AuctionRepository;
import ssafy.a303.backend.auction.repository.BidRepository;
import ssafy.a303.backend.common.exception.CustomException;
import ssafy.a303.backend.common.response.ErrorCode;
import ssafy.a303.backend.notice.entity.NotificationReservation;
import ssafy.a303.backend.notice.entity.NotificationType;
import ssafy.a303.backend.notice.entity.ReservationStatus;
import ssafy.a303.backend.notice.repository.NotificationReservationRepository;
import ssafy.a303.backend.user.entity.User;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AuctionWinnerService {

    private final AuctionRepository auctionRepository;
    private final BidRepository bidRepository;
    private final NotificationReservationRepository reservationRepository;

    /**
     * 경매 종료 시 호출:
     * - 상위 5명 rank
     * - 1등에게 OFFERED + 알림 예약
     */
    public void prepareWinnersAndOfferFirst(int auctionSeq) {
        Auction auction = auctionRepository.findById(auctionSeq)
                .orElseThrow(() -> new CustomException(ErrorCode.AUCTION_NOT_FOUND));

        // 상위 5명 가져오기
        List<Bid> topBids = bidRepository.findTopBids(
                auctionSeq,
                PageRequest.of(0, 5)
        );

        if (topBids.isEmpty()) {
            // 입찰 없는 경매라면 아무것도 안 함
            return;
        }

        // rank 세팅 + 초기 상태 WAITING 으로 정리
        int rank = 1;
        for (Bid bid : topBids) {
            bid.setRank(rank++);
            bid.setStatus(BidStatus.WAITING);
            bid.setDecidedAt(null);
        }

        // 1등에게 OFFERED + 알림 예약
        Bid first = topBids.get(0);
        offerToBidder(first);
    }

    /**
     * 특정 입찰자에게 낙찰 기회를 주고 알림 예약 생성
     */
    private void offerToBidder(Bid bid) {
        bid.setStatus(BidStatus.OFFERED);
        bid.setDecidedAt(LocalDateTime.now());

        User winnerCandidate = bid.getUser();
        Auction auction = bid.getAuction();

        NotificationReservation reservation = NotificationReservation.builder()
                .user(winnerCandidate)
                .auction(auction)
                .type(NotificationType.AUCTION_WINNER)
                .status(ReservationStatus.PENDING)
                .scheduledAt(LocalDateTime.now())
                .build();

        reservationRepository.save(reservation);
    }

    /**
     * 낙찰 수락
     */
    public void acceptWinner(int userSeq, int auctionSeq) {
        Bid offered = bidRepository
                .findFirstByAuction_AuctionSeqAndStatusOrderByRankAsc(auctionSeq, BidStatus.OFFERED)
                .orElseThrow(() -> new CustomException(ErrorCode.BID_NOT_FOUND));

        if (!offered.getUser().getUserSeq().equals(userSeq)) {
            throw new CustomException(ErrorCode.FORBIDDEN);
        }

        // ACCEPTED
        offered.setStatus(BidStatus.ACCEPTED);
        offered.setDecidedAt(LocalDateTime.now());

        // 낙찰받은 사람보다 뒤 rank 는 모두 LOST
        int myRank = offered.getRank();
        List<Bid> others = bidRepository.findByAuction_AuctionSeqAndRankGreaterThan(auctionSeq, myRank);
        for (Bid other : others) {
            other.setStatus(BidStatus.LOST);
            other.setDecidedAt(LocalDateTime.now());
        }
    }

    /**
     * 낙찰 취소
     */
    public void rejectWinner(int userSeq, int auctionSeq) {
        Bid offered = bidRepository
                .findFirstByAuction_AuctionSeqAndStatusOrderByRankAsc(auctionSeq, BidStatus.OFFERED)
                .orElseThrow(() -> new CustomException(ErrorCode.BID_NOT_FOUND)); // 현재 제안된 낙찰 없음

        if (!offered.getUser().getUserSeq().equals(userSeq)) {
            throw new CustomException(ErrorCode.FORBIDDEN);
        }

        // REJECTED
        offered.setStatus(BidStatus.REJECTED);
        offered.setDecidedAt(LocalDateTime.now());

        int currentRank = offered.getRank();

        // 2) 다음 WAITING 후보 찾기
        bidRepository.findFirstByAuction_AuctionSeqAndStatusAndRankGreaterThanOrderByRankAsc(
                        auctionSeq, BidStatus.WAITING, currentRank
                )
                .ifPresentOrElse(
                        this::offerToBidder,     // 다음 순위에게 OFFERED + 알림 예약
                        () -> {
                        }
                );
    }
}
