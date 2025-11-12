package ssafy.a303.backend.auction.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ssafy.a303.backend.auction.entity.Auction;
import ssafy.a303.backend.auction.entity.AuctionStatus;

import java.util.Optional;

public interface AuctionRepository extends JpaRepository<Auction, Integer> {

    /** 사람과 매물의 경매 상태 확인 */
    @Query("""
            select count(a) > 0
            from Auction a
            where a.property.propertySeq = :propertySeq
                and a.user.userSeq = :userSeq
                and a.status in :status
        """)
    boolean existsActiveByPropertyAndUser(@Param("propertySeq") Integer propertySeq,
                                          @Param("userSeq") Integer userSeq,
                                          @Param("status")AuctionStatus status);

    Optional<Auction> findByAuctionSeqAndUser_UserSeq(Integer auctionSeq, Integer userSeq);

}
