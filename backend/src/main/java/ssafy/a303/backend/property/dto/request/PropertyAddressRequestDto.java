package ssafy.a303.backend.property.dto.request;

public record PropertyAddressRequestDto(
        String lessorNm,
        String propertyNm,
        String address,
        Double latitude,
        Double longitude
) {}
