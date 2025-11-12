package ssafy.a303.backend.auction.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ssafy.a303.backend.auction.entity.Auction;
import ssafy.a303.backend.chat.entity.ChatMessage;

@Repository
public interface AuctionRepository extends JpaRepository<Auction, Integer> {

}
