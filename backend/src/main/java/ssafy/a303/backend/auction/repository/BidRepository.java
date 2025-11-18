package ssafy.a303.backend.auction.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ssafy.a303.backend.auction.entity.Bid;
import ssafy.a303.backend.auction.entity.BidStatus;

import java.util.List;
import java.util.Optional;

public interface BidRepository extends JpaRepository<Bid, Integer> {

    Optional<Bid> findBidByUser_UserSeqAndAuction_AuctionSeqAndStatus(int userSeq, int auctionSeq, BidStatus bidStatus);

    List<Bid> findByAuction_AuctionSeq(Integer auctionSeq);

    List<Bid> findByAuction_AuctionSeqAndRankLessThanOrderByRankAsc(Integer auctionSeq, Integer rankLimit);

}
