package ssafy.a303.backend.property.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import ssafy.a303.backend.property.enums.Building;
import ssafy.a303.backend.property.enums.Facing;

import java.util.List;

public record PropertyRegiResponseDto(
        @Schema(description = "매물 seq", example = "1")
        Integer propertySeq
) {
}