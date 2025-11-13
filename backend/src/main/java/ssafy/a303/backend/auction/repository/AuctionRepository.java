package ssafy.a303.backend.auction.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ssafy.a303.backend.auction.dto.response.BrkApplicantResponseDto;
import ssafy.a303.backend.auction.entity.Auction;
import ssafy.a303.backend.auction.entity.AuctionStatus;

import java.util.Collection;
import java.util.List;
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

    

}
