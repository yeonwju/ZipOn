package ssafy.a303.backend.auction.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import ssafy.a303.backend.auction.entity.AuctionStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public record BrkApplicantResponseDto(
        @Schema(description = "경매 seq", defaultValue = "1")
        Integer auctionSeq,
        @Schema(description = "중개인의 user seq", defaultValue = "1")
        Integer brkUserSeq,
        @Schema(description = "중개인의 이름", defaultValue = "김싸피")
        String brkNm,
        @Schema(description = "중개인의 이미지 s3 key", defaultValue = "lkjsdflk")
        String brkProfileImg,
        @Schema(description = "경매 상태", defaultValue = "REQUIRED")
        AuctionStatus status,
        @Schema(description = "거래 성사 횟수", defaultValue = "127")
        Integer mediateCnt,
        @Schema(description = "자기소개", defaultValue = "열심히 하겠슴다")
        String intro,
        @Schema(description = "경매 날짜", example = "2025-12-12")
        LocalDate strmDate,
        @Schema(description = "경매 시작 시간", example = "16:00:00")
        LocalTime strmStartTm,
        @Schema(description = "경매 종료 시간", example = "17:00:00")
        LocalTime strmEndTm
) {
}
