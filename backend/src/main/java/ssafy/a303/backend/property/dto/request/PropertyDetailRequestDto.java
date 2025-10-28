package ssafy.a303.backend.property.dto.request;

import ssafy.a303.backend.property.enums.Facing;

public record PropertyDetailRequestDto(
        String content,
        Double area,
        Integer areaP,
        Long deposit,
        Integer mnRent,
        Integer fee,
        String thumbnail,
        Byte period,
        Byte floor,
        Facing facing,
        Byte roomCnt,
        String constructionDate,
        Byte bathroomCnt,
        Byte parkingCnt,
        Boolean hasElevator,
        Boolean petAvailable,
        Boolean isAucPref,
        Boolean isBrkPref,
        String aucAt,
        String aucAvailable
) {
}
