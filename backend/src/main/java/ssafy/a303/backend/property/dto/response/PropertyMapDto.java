package ssafy.a303.backend.property.dto.response;

import ssafy.a303.backend.property.enums.Building;

public record PropertyMapDto(
        String address,
        String propertyNm,
        Double latitude,
        Double longitude,
        Double area,
        Integer areaP,
        Long deposit,
        Integer mnRent,
        Integer fee,
        Building facing,
        Byte roomCnt,
        Byte floor
) {
}
