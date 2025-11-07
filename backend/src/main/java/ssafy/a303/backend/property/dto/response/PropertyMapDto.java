package ssafy.a303.backend.property.dto.response;

public record PropertyMapDto(
        String address,
        String propertyNm,
        Double latitude,
        Double longitude,
        Double area,
        Integer areaP,
        Long deposit,
        Integer mnRent,
        Integer fee
) {
}
