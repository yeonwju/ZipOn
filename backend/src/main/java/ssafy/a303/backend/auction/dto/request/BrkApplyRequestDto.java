package ssafy.a303.backend.auction.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;
import java.time.LocalTime;

public record BrkApplyRequestDto(

        @Schema(description = "방송 날짜", example = "2025-12-12")
        LocalDate strmDate,
        @Schema(description = "방송 시작 시간", example = "16:00:00")
        LocalTime strmStartTm,
        @Schema(description = "방송 종료 시간", example = "17:00:00")
        LocalTime strmEndTm,
        @Schema(description = "경매 종료 시간", example = "12:00:00")
        LocalTime auctionEndAt,
        @Schema(description = "자기소개", example = "겁나 빨리 팝니다")
        String intro
) {
}
