package ssafy.a303.backend.auction.dto.request;

import java.time.LocalDate;
import java.time.LocalTime;

public record BrkApplyRequestDto(

        LocalDate strmDate,
        LocalTime strmStartTm,
        LocalTime strmEndTm,
        String intro
) {
}
