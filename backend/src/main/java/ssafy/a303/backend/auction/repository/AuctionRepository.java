package ssafy.a303.backend.auction.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ssafy.a303.backend.auction.dto.response.BrkApplicantResponseDto;
import ssafy.a303.backend.auction.entity.Attendance;
import ssafy.a303.backend.auction.entity.Auction;
import ssafy.a303.backend.auction.entity.AuctionStatus;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface AuctionRepository extends JpaRepository<Auction, Integer> {

    /** 경매 ID로 조회 (Property Fetch Join) - 라이브 방송용 */
    @Query("SELECT a FROM Auction a JOIN FETCH a.property WHERE a.auctionSeq = :auctionSeq")
    Optional<Auction> findByIdWithProperty(@Param("auctionSeq") Integer auctionSeq);

    /** 사용자의 ACCEPTED 상태 경매 리스트 조회 (Property Fetch Join) - 라이브 방송 가능 경매 리스트 */
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

    /** 특정 경매의 신청 정보를 user seq로 찾기 */
    Optional<Auction> findByAuctionSeqAndUser_UserSeq(Integer auctionSeq, Integer userSeq);

    /** 매물 seq로 해당 매물에 신청한 중개인 정보 조회 */
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

    /** ACCEPTED 상태인 중개 매칭 정보 */
    Optional<Auction> findByProperty_PropertySeqAndStatus(Integer propertySeq, AuctionStatus status);

    /**
     * 나의 경매 참여 내역 + 각 경매에서의 실제 순위까지 한 번에 조회하는 쿼리
     * 반환 컬럼:
     * 0: thumbnail (매물 썸네일)
     * 1: auctionSeq (경매 식별자)
     * 2: propertySeq (매물 식별자)
     * 3: attendanceStatus (입찰 상태)
     * 4: address (매물 주소)
     * 5: bidAmount (입찰 금액)
     * 6: bidRank (해당 경매에서 나보다 앞선 사람 수) ★
     */
    @Query("""
    SELECT auc.property.thumbnail as thumbnail,
           auc.auctionSeq as auctionSeq,
           auc.property.propertySeq as propertySeq,
           at.status as attendanceStatus,
           auc.property.address as address,
           at.bidAmount as bidAmount,
           (SELECT COUNT(at2)
            FROM Attendance at2
            WHERE at2.auction.auctionSeq = at.auction.auctionSeq
            AND at2.status != 'REJECTED'
            AND at2.rank < at.rank) as bidRank
    FROM Attendance at
    JOIN at.auction auc
    WHERE at.user.userSeq = :userSeq
    ORDER BY at.rank DESC
    """)
    List<Object[]> getMyAuctionsWithRank(@Param("userSeq") Integer userSeq);

}
