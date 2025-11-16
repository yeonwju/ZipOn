package ssafy.a303.backend.auction.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ssafy.a303.backend.auction.dto.response.BrkApplicantResponseDto;
import ssafy.a303.backend.auction.entity.Auction;
import ssafy.a303.backend.auction.entity.AuctionStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface AuctionRepository extends JpaRepository<Auction, Integer> {

    /**
     * 경매 ID로 조회 (Property Fetch Join) - 라이브 방송용
     */
    @Query("SELECT a FROM Auction a JOIN FETCH a.property WHERE a.auctionSeq = :auctionSeq")
    Optional<Auction> findByIdWithProperty(@Param("auctionSeq") Integer auctionSeq);

    /**
     * 사용자의 ACCEPTED 상태 경매 리스트 조회 (Property Fetch Join) - 라이브 방송 가능 경매 리스트
     */
    @Query("""
            SELECT a FROM Auction a
            JOIN FETCH a.property 
            WHERE a.user.userSeq = :userSeq 
            AND a.status = :status 
            AND NOT EXISTS (
                SELECT 1 FROM LiveStream ls 
                WHERE ls.auction.auctionSeq = a.auctionSeq
            )
            ORDER BY a.createdAt DESC
            """)
    List<Auction> findByUserSeqAndStatus(@Param("userSeq") Integer userSeq, @Param("status") AuctionStatus status);

    /**
     * 사람과 매물의 경매 상태 확인
     */
    @Query("""
                select count(a) > 0
                from Auction a
                where a.property.propertySeq = :propertySeq
                    and a.user.userSeq = :userSeq
                    and a.status in :status
            """)
    boolean existsActiveByPropertyAndUser(@Param("propertySeq") Integer propertySeq,
                                          @Param("userSeq") Integer userSeq,
                                          @Param("status") AuctionStatus status);

    /**
     * 특정 경매의 신청 정보를 user seq로 찾기
     */
    Optional<Auction> findByAuctionSeqAndUser_UserSeq(Integer auctionSeq, Integer userSeq);

    /**
     * 매물 seq로 해당 매물에 신청한 중개인 정보 조회
     */
    @Query(value = """
            select new ssafy.a303.backend.auction.dto.response.BrkApplicantResponseDto(
            a.auctionSeq,
            u.userSeq,
            u.nickname,
            u.profileImg,
            a.status,
            b.mediateCnt,
            a.intro,
            a.strmDate,
            a.strmStartTm,
            a.strmEndTm
            )
            from Auction a
            join a.user u
            join Broker b on b.user.userSeq = u.userSeq
            where a.property.propertySeq = :propertySeq
            and a.status in :status
            """,
            countQuery = """
                    select count(a)
                    from Auction a
                    where a.property.propertySeq = :propertySeq
                    and a.status in :status
                    """)
    Page<BrkApplicantResponseDto> findApplicantsByPropertySeq(@Param("propertySeq") Integer propertySeq, @Param("status") List<AuctionStatus> status, Pageable pageable);

    /**
     * ACCEPTED 상태인 중개 매칭 정보
     */
    Optional<Auction> findByProperty_PropertySeqAndStatus(Integer propertySeq, AuctionStatus status);


    @Query(value = """
            select a.auctionSeq
            from Auction a
            where
                a.status = 'ACCEPTED'
                and a.auctionStartAt <= :now
                and a.auctionEndAt > :now
            """
    )
    List<Integer> findAuctionWhatToStart(@Param("now") LocalDateTime now);

    @Query(value = """
            select a.auctionSeq
            from Auction a
            where
                a.status = 'ACCEPTED'
                and a.finish = false
                and a.auctionEndAt <= :now
            """
    )
    List<Integer> findAuctionWhatAreEnd(@Param("now") LocalDateTime now);

    @Modifying(clearAutomatically = true)
    @Query("""
            update Auction a
            set a.finish = true
            where a.status = 'ACCEPTED'
                and a.auctionSeq in (:auctionSeqs)
            """)
    int updateFinishByAuctionSeqIn(@Param("auctionSeqs") List<Integer> auctionSeqs);

}
