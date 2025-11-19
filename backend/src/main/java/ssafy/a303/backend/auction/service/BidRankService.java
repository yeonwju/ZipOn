package ssafy.a303.backend.auction.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ssafy.a303.backend.auction.dto.request.BidEventMessage;
import ssafy.a303.backend.auction.entity.Auction;
import ssafy.a303.backend.auction.entity.Bid;
import ssafy.a303.backend.auction.entity.BidStatus;
import ssafy.a303.backend.auction.repository.*;
import ssafy.a303.backend.common.exception.CustomException;
import ssafy.a303.backend.common.helper.DataSerializer;
import ssafy.a303.backend.common.response.ErrorCode;
import ssafy.a303.backend.user.entity.User;
import ssafy.a303.backend.user.repository.UserRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class BidRankService {

    private final BidRankRepository bidRankRepository;
    private final AuctionInProgressRepository auctionInProgressRepository;
    private final BidRepository bidRepository;
    private final UserRepository userRepository;
    private final AuctionRepository auctionRepository;
    private final BidTryCountRepository bidTryCountRepository;
    private static final int LIMIT = 10;

    public void check (BidEventMessage message){
        if(!auctionInProgressRepository.checkAuctionInProgress(message.auctionSeq()))
            throw new CustomException(ErrorCode.AUCTION_NOT_IN_PROGRESS);
        if(bidTryCountRepository.hasAlreadyBid(message.userSeq(), message.auctionSeq())){
            throw new CustomException(ErrorCode.ALREADY_BID);
        }
    }

    public void updateRanking(BidEventMessage message) {
        if(!auctionInProgressRepository.checkAuctionInProgress(message.auctionSeq()))
            return;
        if(bidTryCountRepository.hasAlreadyBid(message.userSeq(), message.auctionSeq())){
            return;
        }
        // 입찰 여부 등록
        boolean firstTime = bidTryCountRepository.tryFirstBid(message.auctionSeq(), message.userSeq());
        if(firstTime){
            log.info(String.format("매물번호: %s, 입찰자: %s , 입찰액: %s", message.auctionSeq(), message.userSeq(), message.amount()));
            bidRankRepository.updateScore(message);
        }
    }

    @Transactional
    public void saveRedisToDataBase(int auctionSeq) {
        Set<String> top = bidRankRepository.getTopUsers(auctionSeq, LIMIT);
        Set<String> rest = bidRankRepository.getRestUsers(auctionSeq, LIMIT);

        Auction auction = auctionRepository.getReferenceById(auctionSeq);

        saveDB(top, auction, true);
        saveDB(rest, auction, false);

        bidRankRepository.deleteKey(auctionSeq);
        bidTryCountRepository.deleteKey(auctionSeq);
        auctionInProgressRepository.deleteKey(auctionSeq);
    }

    private void saveDB(Set<String> data, Auction auction, boolean isRanker) {
        int rank = 0;
        List<Bid> bids = new ArrayList<>();
        for (String json : data) {
            BidEventMessage msg = DataSerializer.deserialize(json, BidEventMessage.class);
            User user = userRepository.getReferenceById(msg.userSeq());

            int finalRank;
            BidStatus status;

            if (isRanker) {
                finalRank = rank++;
                status = (finalRank == 0) ? BidStatus.OFFERED : BidStatus.WAITING;
            } else {
                finalRank = 999;
                status = BidStatus.LOST;
            }

            Bid bid = Bid.builder()
                    .user(user)
                    .auction(auction)
                    .bidAt(msg.bidAt())
                    .bidAmount(msg.amount().intValue())
                    .rank(finalRank)
                    .status(status)
                    .build();

            bids.add(bid);
        }
        bidRepository.saveAll(bids);
    }

    public BidEventMessage readBidInRedis(int auctionSeq, int userSeq){
        return bidRankRepository.getUser(auctionSeq, userSeq);
    }
}
