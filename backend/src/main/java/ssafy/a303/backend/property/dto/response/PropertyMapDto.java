package ssafy.a303.backend.property.dto.response;

import ssafy.a303.backend.property.enums.Facing;

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
        Facing facing,
        Byte roomCnt,
        Byte floor
) {
}
