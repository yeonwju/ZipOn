package ssafy.a303.backend.auction.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public record BrkApplyResponseDto(
        Integer auctionSeq,
        Integer propertySeq,
        Integer userSeq,
        String status,
        LocalDate strmDate,
        LocalTime strmStartTm,
        LocalTime strmEndTm,
        LocalDateTime auctionEndAt
) {
}
