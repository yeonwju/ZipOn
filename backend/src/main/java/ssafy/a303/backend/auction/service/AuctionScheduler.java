package ssafy.a303.backend.auction.service;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ssafy.a303.backend.auction.entity.Auction;
import ssafy.a303.backend.auction.entity.Bid;
import ssafy.a303.backend.auction.entity.BidStatus;
import ssafy.a303.backend.auction.repository.AuctionInProgressRepository;
import ssafy.a303.backend.auction.repository.AuctionRepository;
import ssafy.a303.backend.auction.repository.BidRepository;
import ssafy.a303.backend.common.helper.KoreaClock;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class AuctionScheduler {
    private final AuctionRepository auctionRepository;
    private final AuctionInProgressRepository auctionInProgressRepository;
    private final BidRankService bidRankService;
    private final BidRepository bidRepository;

    /* 주기적으로 시작되어야할 경매를 redis에 등록 */
    @Scheduled(fixedDelay = 10, timeUnit = TimeUnit.SECONDS) // 10초
    @Transactional
    public void enrollAuctionInProgress() {
        LocalDateTime now = LocalDateTime.now(KoreaClock.getClock());
        List<Integer> auctionSeqs = auctionRepository.findAuctionWhatToStart(now);

        for (Integer auctionSeq : auctionSeqs) {
            auctionInProgressRepository.enrollAuctionInProgress(auctionSeq);
        }
    }

    /* 종료되어야할 경매 처리 */
    @Scheduled(cron = "0 0 12 * * *", zone = "Asia/Seoul")
    @Transactional
    public void endAuctionProcess() {
        LocalDateTime now = LocalDateTime.now(KoreaClock.getClock());

        List<Integer> auctionSeqs = auctionRepository.findAuctionWhatAreEnd(now);
        if (auctionSeqs.isEmpty()) return;

        for (Integer auctionSeq : auctionSeqs) {
            bidRankService.saveRedisToDataBase(auctionSeq);
        }

        auctionRepository.updateFinishByAuctionSeqIn(auctionSeqs);
    }

    /* 종료되고 우승자가 정해지지 않은 경매 중에서
    (종료 시각) + (등수 * 1시간) < (현재 시각)
    인 경우 거절 처리 */
    @Scheduled(fixedDelay = 1, timeUnit = TimeUnit.HOURS)
    @Transactional
    public void processOfferTimeoutAndNext() {
        LocalDateTime now = LocalDateTime.now(KoreaClock.getClock());

        // 1. 끝났지만 winnerSeq가 아직 정해지지 않은 경매들
        List<Auction> auctions = auctionRepository.findFinishedWithoutWinner();

        for (Auction auction : auctions) {
            processSingleAuction(auction, now);
        }
    }

    private void processSingleAuction(Auction auction, LocalDateTime now) {
        Integer auctionSeq = auction.getAuctionSeq();

        // =========== 후보자 조회 ==============
        List<Bid> rankers =
                bidRepository.findByAuction_AuctionSeqAndRankLessThanOrderByRankAsc(auctionSeq, 10);

        // 아예 없으면 유찰 처리: winnerSeq = -1
        if (rankers.isEmpty()) {
            auction.setWinnerSeq(-1);
            return;
        }

        for (Bid b : rankers) {
            BidStatus status = b.getStatus();

            // 이미 최종 상태인 애들은 그대로 둠
            if (status == BidStatus.TIMEOUT
                    || status == BidStatus.REJECTED
                    || status == BidStatus.LOST
                    || status == BidStatus.ACCEPTED) {
                continue;
            }

            // 만료 처리
            int rank = b.getRank();
            LocalDateTime due = auction.getAuctionEndAt().plusHours(rank + 1);

            if (now.isAfter(due)) {
                b.setStatus(BidStatus.TIMEOUT);
                continue;
            }
            //  ======= 다음 offer ======
            b.setStatus(BidStatus.OFFERED);
            break; // 한명만
        }

        // ============== 이제 가능한 사람이 없다면 ================
        boolean hasCandidate = rankers.stream().anyMatch(b ->
                b.getStatus() == BidStatus.OFFERED ||
                        b.getStatus() == BidStatus.WAITING ||
                        b.getStatus() == BidStatus.ACCEPTED
        );

        // OFFERED / WAITING / ACCEPTED 다 사라졌다면 → 유찰 처리
        if (!hasCandidate) {
            auction.setWinnerSeq(-1);
        }
    }
}