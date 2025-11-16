package ssafy.a303.backend.auction.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ssafy.a303.backend.auction.dto.request.BidEventMessage;
import ssafy.a303.backend.auction.entity.Auction;
import ssafy.a303.backend.auction.entity.Bid;
import ssafy.a303.backend.auction.entity.BidStatus;
import ssafy.a303.backend.auction.repository.AuctionRepository;
import ssafy.a303.backend.auction.repository.BidOnGoingRepository;
import ssafy.a303.backend.auction.repository.BidRepository;
import ssafy.a303.backend.common.exception.CustomException;
import ssafy.a303.backend.common.helper.DataSerializer;
import ssafy.a303.backend.common.response.ErrorCode;
import ssafy.a303.backend.user.entity.User;
import ssafy.a303.backend.user.repository.UserRepository;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class BidOnGoingService {

    private final BidOnGoingRepository bidOnGoingRepository;
    private final BidRepository bidRepository;
    private final UserRepository userRepository;
    private final AuctionRepository auctionRepository;
    private static final int LIMIT = 10;

    public void updateRanking(BidEventMessage message) {
        auctionRepository.findById(message.auctionSeq()).orElseThrow(() -> new CustomException(ErrorCode.AUCTION_NOT_FOUND));
        bidOnGoingRepository.updateScore(message);
    }

    @Transactional
    public void saveRedisToDataBase(int auctionSeq) {
        Set<String> top = bidOnGoingRepository.getTopUsers(auctionSeq, LIMIT);
        Set<String> rest = bidOnGoingRepository.getRestUsers(auctionSeq, LIMIT);

        saveDB(top, true);
        saveDB(rest, false);
    }

    private void saveDB(Set<String> data, boolean isRanker) {
        int rank = 1;

        for (String json : data) {
            BidEventMessage msg = DataSerializer.deserialize(json, BidEventMessage.class);
            User user = userRepository.getReferenceById(msg.userSeq());
            Auction auction = auctionRepository.getReferenceById(msg.auctionSeq());

            int finalRank;
            BidStatus status;

            if (isRanker) {
                finalRank = rank++;
                status = (finalRank == 1) ? BidStatus.OFFERED : BidStatus.WAITING;
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

            bidRepository.save(bid);
        }
    }
}
