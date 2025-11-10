package ssafy.a303.backend.property.dto.response;

import lombok.Data;
import ssafy.a303.backend.property.enums.Facing;

@Data
public record PropertyUpdateResponseDto(
        Integer propertySeq,
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
