package ssafy.a303.backend.auction.repository;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ssafy.a303.backend.auction.entity.Bid;
import ssafy.a303.backend.auction.entity.BidStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface BidRepository extends JpaRepository<Bid, Integer> {

    /* 경매 번호로 입찰 찾기 */
    Optional<Bid> findBidByUser_UserSeqAndAuction_AuctionSeqAndStatus(int userSeq, int auctionSeq, BidStatus bidStatus);
    List<Bid> findByAuction_AuctionSeq(Integer auctionSeq);
    List<Bid> findByAuction_AuctionSeqAndRankLessThanOrderByRankAsc(Integer auctionSeq, Integer rankLimit);

    /**
     * 특정 경매에서 상위 입찰자 N명 가져오기
     * (높은 금액 우선, 동일 금액이면 먼저 입찰한 사람)
     */
    @Query("""
        select b
        from Bid b
        where b.auction.auctionSeq = :auctionSeq
        order by b.bidAmount desc, b.bidAt asc
        """)
    List<Bid> findTopBids(
            @Param("auctionSeq") int auctionSeq,
            PageRequest pageRequest
    );

    /**
     * 현재 OFFERED인 사용자 찾기
     */
    Optional<Bid> findFirstByAuction_AuctionSeqAndStatusOrderByRankAsc(
            int auctionSeq,
            BidStatus status
    );

    /**
     * 현재 rank 보다 뒤에서 WAITING 상태인 다음 후보 찾기
     */
    Optional<Bid> findFirstByAuction_AuctionSeqAndStatusAndRankGreaterThanOrderByRankAsc(
            int auctionSeq,
            BidStatus status,
            int rank
    );

    /**
     * 특정 rank 이후의 모든 후보
     */
    List<Bid> findByAuction_AuctionSeqAndRankGreaterThan(
            int auctionSeq,
            int rank
    );

    /**
     * OFFERED 상태인데 너무 오래 응답이 없는 것들
     */
    List<Bid> findByStatusAndDecidedAtBefore(
            BidStatus status,
            LocalDateTime decidedAtBefore
    );


}
