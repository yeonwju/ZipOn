package ssafy.a303.backend.property.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

public record PropertyAucInfoUpdateResponseDto(

        @Schema(description = "매물 seq", example = "1")
        Integer propertySeq,
        @Schema(description = "경매 여부", example = "true")
        Boolean isAucPref,
        @Schema(description = "중개인 여부", example = "true")
        Boolean isBrkPref,
        @Schema(description = "경매 일자", example = "2025-12-12")
        LocalDateTime aucAt,
        @Schema(description = "경매 가능 일시", example = "2025-12-12")
        String aucAvailable
) {
}
