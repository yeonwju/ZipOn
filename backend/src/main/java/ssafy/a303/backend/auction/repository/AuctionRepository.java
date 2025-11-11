package ssafy.a303.backend.auction.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ssafy.a303.backend.auction.entity.Auction;

public interface AuctionRepository extends JpaRepository<Auction, Integer> {

}
