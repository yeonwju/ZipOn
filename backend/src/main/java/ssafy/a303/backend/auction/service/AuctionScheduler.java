package ssafy.a303.backend.auction.service;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ssafy.a303.backend.auction.repository.AuctionInProgressRepository;
import ssafy.a303.backend.auction.repository.AuctionRepository;
import ssafy.a303.backend.common.helper.KoreaClock;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuctionScheduler {
    private final AuctionRepository auctionRepository;
    private final AuctionInProgressRepository auctionInProgressRepository;
    private final BidRankService bidRankService;

    /* 주기적으로 시작되어야할 경매를 redis에 등록 */
    @Scheduled(fixedDelay = 10_000L) // 10초
    @Transactional
    public void enrollAuctionInProgress(){
        LocalDateTime now = LocalDateTime.now(KoreaClock.getClock());
        List<Integer> auctionSeqs = auctionRepository.findAuctionWhatToStart(now);

        for(Integer auctionSeq : auctionSeqs){
            auctionInProgressRepository.enrollAuctionInProgress(auctionSeq);
        }
    }

    /* 종료되어야할 경매 처리 */
    @Scheduled(cron = "0 0 12 * * *", zone = "Asia/Seoul")
    @Transactional
    public void endAuctionProcess(){
        LocalDateTime now = LocalDateTime.now(KoreaClock.getClock());

        List<Integer>auctionSeqs = auctionRepository.findAuctionWhatAreEnd(now);
        if(auctionSeqs.isEmpty()) return;

        for(Integer auctionSeq : auctionSeqs){
            bidRankService.saveRedisToDataBase(auctionSeq);
        }

        auctionRepository.updateFinishByAuctionSeqIn(auctionSeqs);
    }
}
