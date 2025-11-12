package ssafy.a303.backend.auction.dto.projection;

import java.time.LocalDate;
import java.time.LocalTime;

public interface AuctionAlarmProjection {
    Long getAuctionAlarmSeq();
    Integer getUserSeq();
    Integer getAuctionSeq();
    Integer getPropertySeq();
    String getPropertyNm();
    LocalDate getStrmDate();
    LocalTime getStrmStartTm();
}