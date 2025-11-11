package ssafy.a303.backend.property.dto.response;

import lombok.Data;

public record PropertyAucInfoUpdateResponseDto(
        Integer propertySeq,
        Boolean isAucPref,
        Boolean isBrkPref,
        String aucAt,
        String aucAvailable
) {
}
