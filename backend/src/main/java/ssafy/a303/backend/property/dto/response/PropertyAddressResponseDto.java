package ssafy.a303.backend.property.dto.response;

public record PropertyAddressResponseDto(
        Integer propertySeq,
        String lessorNm,
        String address,
        Integer latitude,
        Integer longitude
) {
}
