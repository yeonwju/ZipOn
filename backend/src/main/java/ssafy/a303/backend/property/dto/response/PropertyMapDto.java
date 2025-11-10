package ssafy.a303.backend.property.dto.response;

import lombok.Data;
import ssafy.a303.backend.property.enums.Facing;

@Data
public record PropertyMapDto(

        Integer proprtySeq,
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
