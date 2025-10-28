package ssafy.a303.backend.property.dto.request;

public record PropertyAddressRequestDto(
        String lessorNm,
        String address,
        Integer latitude,
        Integer longitude
) {}
