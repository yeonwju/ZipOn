package ssafy.a303.backend.property.dto.response;

import lombok.Data;

public record PropertyAddressResponseDto(
        Integer propertySeq,
        String lessorNm,
        String address,
        Double latitude,
        Double longitude
) {
}
