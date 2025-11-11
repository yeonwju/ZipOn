package ssafy.a303.backend.property.dto.request;

import lombok.Data;

public record PropertyAucInfoUpdateRequestDto(
        Boolean isAucPref,
        Boolean isBrkPref,

        String aucAt,
        String aucAvailable

) {
}
