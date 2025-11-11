package ssafy.a303.backend.property.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import ssafy.a303.backend.property.enums.Facing;

public record PropertyMapDto(
        @Schema(description = "매물 seq", example = "1")
        Integer proprtySeq,
        @Schema(description = "주소", example = "서울특별시 강남구 테헤란로 42-232")
        String address,
        @Schema(description = "매물 이름", example = "멀티캠퍼스")
        String propertyNm,
        @Schema(description = "위도", example = "12.945387")
        Double latitude,
        @Schema(description = "경도", example = "78.658784")
        Double longitude,
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
        @Schema(description = "방향(N,S,W,E,NE,NW,SE,SW)", example = "S")
        Facing facing,
        @Schema(description = "방 갯수", example = "4")
        Byte roomCnt,
        @Schema(description = "층", example = "5")
        Byte floor,

        @Schema(description = "경매 여부", example = "true")
        Boolean isAucPref,
        @Schema(description = "중개인 여부", example = "true")
        Boolean isBrkPref,
        @Schema(description = "중개 성사 여부", example = "true")
        Boolean hasBrk
) {
}
