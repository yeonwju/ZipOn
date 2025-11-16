package ssafy.a303.backend.auction.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ssafy.a303.backend.auction.entity.Auction;
import ssafy.a303.backend.auction.entity.AuctionStatus;
import ssafy.a303.backend.auction.entity.Bid;
import ssafy.a303.backend.auction.repository.AuctionRepository;
import ssafy.a303.backend.auction.repository.BidRepository;
import ssafy.a303.backend.auction.repository.BidTryCountRepository;
import ssafy.a303.backend.common.exception.CustomException;
import ssafy.a303.backend.common.response.ErrorCode;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BidService {

    private final AuctionRepository auctionRepository;
    private final BidRepository bidRepository;
    private final BidTryCountRepository bidTryCountRepository;

    public Bid getMyBidForProperty(Integer userSeq, Integer propertySeq) {
        // 종료된 경매
        Optional<Bid> opt = bidRepository.findBidByUser_UserSeqAndAuction_Property_PropertySeq(userSeq, propertySeq);
        if (opt.isPresent()) return opt.get();
        // 진행 중 경매
        // 1 경매 번호 찾기
        Auction auction = auctionRepository.findByProperty_PropertySeqAndStatus(propertySeq, AuctionStatus.ACCEPTED)
                .orElseThrow(() -> new CustomException(ErrorCode.AUCTION_NOT_FOUND));
        // 2 참여 중인지 탐색
        if (bidTryCountRepository.hasAlreadyBid(userSeq, auction.getAuctionSeq())) {
            return null; // redis를 다시 까보면서 누구인지 찾는 건 비효율 적이므로 했는지만 알려주기
        } else {
            throw new CustomException(ErrorCode.BID_NOT_FOUND);
        }
    }

    public List<Bid> getMyBids(Integer userSeq) {
        Optional<List<Bid>> opt = bidRepository.findBidByUser_UserSeq(userSeq);
        return opt.orElseGet(Collections::emptyList);
    }
}
