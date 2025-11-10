package ssafy.a303.backend.property.dto.request;

import ssafy.a303.backend.property.enums.Building;
import ssafy.a303.backend.property.enums.Facing;

import java.util.List;

public record PropertyDetailRequestDto(
        String lessorNm,
        String address,
        String propertyNm,
        Double latitude,
        Double longitude,
        Building buildingType,
        String content,
        Double area,
        Integer areaP,
        Long deposit,
        Integer mnRent,
        Integer fee,
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
        String aucAt,
        String aucAvailable,

        //AI 관련
        String pdfCode,
        boolean isCertificated,
        Integer riskScore,
        String riskReason
) {
}
