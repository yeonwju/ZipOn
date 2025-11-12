package ssafy.a303.backend.auction.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ssafy.a303.backend.auction.dto.projection.AuctionAlarmProjection;
import ssafy.a303.backend.auction.entity.AuctionAlarm;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface AuctionAlarmRepository extends JpaRepository<AuctionAlarm, Long> {
    @Query("""
        select
            aa.auctionAlarmSeq as auctionAlarmSeq,
            aa.user.userSeq as userSeq,
            a.auctionSeq as auctionSeq,
            p.propertySeq as propertySeq,
            p.propertyNm as propertyNm,
            a.strmDate as strmDate,
            a.strmStartTm as strmStartTm
        from AuctionAlarm aa
        join aa.auction a
        join a.property p
        where a.strmDate = :strmDate
          and a.strmStartTm = :strmStartTm
        """)
    List<AuctionAlarmProjection> findAuctionAlarmStartTargets(
            @Param("strmDate") LocalDate strmDate,
            @Param("strmStartTm") LocalTime strmStartTm
    );

    @Query("""
        select
            aa.auctionAlarmSeq as auctionAlarmSeq,
            aa.user.userSeq as userSeq,
            a.auctionSeq as auctionSeq,
            p.propertySeq as propertySeq,
            p.propertyNm as propertyNm,
            a.strmDate as strmDate,
            a.strmStartTm as strmStartTm
        from AuctionAlarm aa
        join aa.auction a
        join a.property p
        where a.strmDate = :strmDate
          and a.strmEndTm = :strmEndTm
        """)
    List<AuctionAlarmProjection> findAuctionAlarmEndTargets(
            @Param("strmDate") LocalDate strmDate,
            @Param("strmEndTm") LocalTime strmEndTm
    );

    @Query("""
        select
            aa.auctionAlarmSeq as auctionAlarmSeq,
            aa.user.userSeq as userSeq,
            a.auctionSeq as auctionSeq,
            p.propertySeq as propertySeq,
            p.propertyNm as propertyNm,
            a.strmDate as strmDate,
            a.strmStartTm as strmStartTm
        from AuctionAlarm aa
        join aa.auction a
        join a.property p
        where aa.user.userSeq = :userSeq
          and (:cursor is null or aa.auctionAlarmSeq < :cursor)
        order by aa.auctionAlarmSeq desc
        """)
    Slice<AuctionAlarmProjection> findMyAlarmsCursor(
            @Param("userSeq") int userSeq,
            @Param("cursor") Long cursor,    // 첫 페이지는 null 전달
            Pageable pageable                // PageRequest.of(0, size)
    );

}
