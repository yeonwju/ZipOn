package ssafy.a303.backend.auction.dto.request;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public record BrkApplyRequest(
        Integer propertySeq,
        LocalDate strmDate,
        LocalTime strmStartTm,
        LocalTime strmEndTm,
        LocalDateTime auctionEndAt
) {
}
