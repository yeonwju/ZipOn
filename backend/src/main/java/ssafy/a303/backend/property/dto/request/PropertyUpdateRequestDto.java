package ssafy.a303.backend.property.dto.request;

import lombok.Data;
import ssafy.a303.backend.property.enums.Facing;

public record PropertyUpdateRequestDto(
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
        Boolean petAvailable
) {
}
