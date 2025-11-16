package ssafy.a303.backend.auction.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ssafy.a303.backend.auction.entity.Bid;

import java.util.List;
import java.util.Optional;

public interface BidRepository extends JpaRepository<Bid, Integer> {
    Optional<Bid> findBidByUser_UserSeqAndAuction_Property_PropertySeq(Integer userSeq, Integer property);
    Optional<List<Bid>>findBidByUser_UserSeq(Integer userSeq);
}
