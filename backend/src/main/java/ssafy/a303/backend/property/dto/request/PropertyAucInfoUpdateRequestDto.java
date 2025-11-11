package ssafy.a303.backend.property.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import org.jetbrains.annotations.NotNull;

public record PropertyAucInfoUpdateRequestDto(
        @Schema(description = "경매 여부", example = "true")
        Boolean isAucPref,
        @Schema(description = "중개인 여부", example = "true")
        Boolean isBrkPref,
        @Schema(description = "경매 일시", example = "2025-12-12")
        String aucAt,
        @Schema(description = "경매 희망 일시", example = "2025-12-12")
        String aucAvailable

) {
}
