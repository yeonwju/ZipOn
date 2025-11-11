package ssafy.a303.backend.property.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import ssafy.a303.backend.property.enums.Building;
import ssafy.a303.backend.property.enums.Facing;

import java.util.List;

public record PropertyRegiResponseDto(
        @Schema(description = "매물 seq", example = "1")
        Integer propertySeq,

        @Schema(description = "임대인 이름", example = "김싸피")
        String lessorNm,
        @Schema(description = "매물 이름", example = "멀티캠퍼스")
        String propertyNm,
        @Schema(description = "매물 설명", example = "위치도 좋고 따뜻해서 살기 좋아요")
        String content,
        @Schema(description = "주소", example = "서울특별시 강남구 테헤란로 42-232")
        String address,
        @Schema(description = "위도", example = "12.945387")
        Double latitude,
        @Schema(description = "경도", example = "78.658784")
        Double longitude,
        @Schema(description = "빌딩 타입", example = "OFFICE")
        Building buildingType,
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
        @Schema(description = "매물 사진들", example = "[www.jlsfj,slfkjsdl, www.dkfjls.sdjfklsd]")
        List<String> images,
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
        Boolean petAvailable,
        @Schema(description = "경매 여부", example = "true")
        Boolean isAucPref,
        @Schema(description = "중개인 여부", example = "true")
        Boolean isBrkPref,
        @Schema(description = "중개 성사 여부", example = "true")
        Boolean hasBrk,
        @Schema(description = "경매 일자", example = "2025-12-12")
        String aucAt,
        @Schema(description = "경매 가능 일시", example = "2025-12-12")
        String aucAvailable,

        //ai 관련
        @Schema(description = "등기부등본 검증 여부", example = "true")
        boolean isCertificated,
        @Schema(description = "검증 점수", example = "86")
        Integer riskScore,
        @Schema(description = "검증 설명", example = "근저당이 적습니다.")
        String riskReason
) {
}