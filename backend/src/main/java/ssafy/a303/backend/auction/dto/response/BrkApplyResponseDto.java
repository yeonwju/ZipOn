package ssafy.a303.backend.auction.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import ssafy.a303.backend.auction.entity.Auction;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Builder
public record BrkApplyResponseDto(
        @Schema(description = "경매 seq", example = "1")
        Integer auctionSeq,
        @Schema(description = "매물 seq", example = "2")
        Integer propertySeq,
        @Schema(description = "신청한 중개인의 user seq", example = "5")
        Integer userSeq,
        @Schema(description = "신청 상태", example = "REQUIRED")
        String status,
        @Schema(description = "경매 날짜", example = "2025-12-12")
        LocalDate strmDate,
        @Schema(description = "경매 시작 시간", example = "16:00:00")
        LocalTime strmStartTm,
        @Schema(description = "경매 종료 시간", example = "17:00:00")
        LocalTime strmEndTm,
        @Schema(description = "경매 종료 시간날짜", example = "2025-12-13 12:00:00")
        LocalDateTime auctionEndAt,
        @Schema(description = "자기소개", example = "겁나 빨리 팝니다")
        String intro
) {
    public static BrkApplyResponseDto of(Auction a) {
        return new BrkApplyResponseDto(
                a.getAuctionSeq(),
                a.getProperty().getPropertySeq(),
                a.getUser().getUserSeq(),
                a.getStatus().name(),
                a.getStrmDate(),
                a.getStrmStartTm(),
                a.getStrmEndTm(),
                a.getAuctionEndAt(),
                a.getIntro()
        );
    }
}
