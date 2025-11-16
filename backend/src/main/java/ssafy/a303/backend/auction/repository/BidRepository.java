package ssafy.a303.backend.auction.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ssafy.a303.backend.auction.entity.Bid;

public interface BidRepository extends JpaRepository<Bid, Integer> {
}
