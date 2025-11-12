package ssafy.a303.backend.auction.dto.projection;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;
import java.time.LocalTime;

@Schema(name = "AuctionAlarmProjection", description = "사용자가 신청한 경매 알람 항목")
public interface AuctionAlarmProjection {

    @Schema(description = "알람 PK", example = "12345")
    Long getAuctionAlarmSeq();

    @Schema(description = "사용자 PK", example = "101")
    Integer getUserSeq();

    @Schema(description = "경매 PK", example = "2025")
    Integer getAuctionSeq();

    @Schema(description = "매물 PK", example = "3301")
    Integer getPropertySeq();

    @Schema(description = "매물 이름", example = "송파 헬리오 A-1203")
    String getPropertyNm();

    @Schema(description = "방송 날짜(YYYY-MM-DD)", type = "string", example = "2025-11-12")
    LocalDate getStrmDate();

    @Schema(description = "방송 시작 시간(HH:mm:ss)", type = "string", example = "14:00:00")
    LocalTime getStrmStartTm();
}