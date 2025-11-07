package ssafy.a303.backend.property.dto.response;

import ssafy.a303.backend.property.enums.Building;
import ssafy.a303.backend.property.enums.Facing;

import java.util.List;

public record PropertyRegiResponseDto(
        Integer propertySeq,
        String lessorNm,
        String propertyNm,
        String content,
        String address,
        Double latitude,
        Double longitude,
        Building buildingType,
        Double area,
        Integer areaP,
        Long deposit,
        Integer mnRent,
        Integer fee,
        List images,
        Byte period,
        Byte floor,
        Facing facing,
        Byte roomCnt,
        Byte bathroomCnt,
        String constructionDate,
        Byte parkingCnt,
        Boolean hasElevator,
        Boolean petAvailable,
        Boolean isAucPref,
        Boolean isBrkPref,
        Boolean isLinked,
        String aucAt,
        String aucAvailable
) {
}