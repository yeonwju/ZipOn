package ssafy.a303.backend.property.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import ssafy.a303.backend.property.enums.Facing;

public record PropertyUpdateResponseDto(
        @Schema(description = "매물 seq", example = "1")
        Integer propertySeq,
        @Schema(description = "매물 설명", example = "위치도 좋고 따뜻해서 살기 좋아요")
        String content,
        @Schema(description = "면적 m^2", example = "109.7")
        Double area,
        @Schema(description = "평수", example = "42")
        Integer areaP,
        @Schema(description = "보증금", example = "50000000")
        Long deposit,
        @Schema(description = "월세", example = "800000")
        Integer mnRent,
        @Schema(description = "관리비", example = "150000")
        Integer fee,
        @Schema(description = "임대 기간(월)", example = "24")
        Byte period,
        @Schema(description = "층", example = "5")
        Byte floor,
        @Schema(description = "방향(N,S,W,E,NE,NW,SE,SW)", example = "S")
        Facing facing,
        @Schema(description = "방 갯수", example = "4")
        Byte roomCnt,
        @Schema(description = "화장실 갯수", example = "2")
        Byte bathroomCnt,
        @Schema(description = "건물 건축일", example = "2010-01-01")
        String constructionDate,
        @Schema(description = "주차 가능 대수", example = "2")
        Byte parkingCnt,
        @Schema(description = "엘리베이터 여부", example = "true")
        Boolean hasElevator,
        @Schema(description = "반려동물 가능 여부", example = "true")
        Boolean petAvailable
) {
}
