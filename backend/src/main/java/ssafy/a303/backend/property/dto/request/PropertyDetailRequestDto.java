package ssafy.a303.backend.property.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import org.jetbrains.annotations.NotNull;
import ssafy.a303.backend.property.enums.Building;
import ssafy.a303.backend.property.enums.Facing;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record PropertyDetailRequestDto(
        @Schema(description = "임대인 이름", example = "김싸피")
        @NotNull
        String lessorNm,
        @Schema(description = "주소", example = "서울특별시 강남구 테헤란로 42-232")
        @NotNull
        String address,
        @Schema(description = "매물 이름", example = "멀티캠퍼스")
        @NotNull
        String propertyNm,

        @Schema(description = "위도", example = "12.945387")
        @NotNull
        Double latitude,
        @Schema(description = "경도", example = "78.658784")
        @NotNull
        Double longitude,
        @Schema(description = "건물 종류(APT,VILLA,ROOM,OFFICE)", example = "OFFICE")
        @NotNull
        Building buildingType,
        @Schema(description = "매물 설명", example = "위치도 좋고 따뜻해서 살기 좋아요")
        @NotNull
        String content,
        @Schema(description = "면적 m^2", example = "109.7")
        @NotNull
        Double area,
        @Schema(description = "평수", example = "42")
        @NotNull
        Integer areaP,
        @Schema(description = "보증금", example = "50000000")
        @NotNull
        Long deposit,
        @Schema(description = "월세", example = "800000")
        @NotNull
        Integer mnRent,
        @Schema(description = "관리비", example = "150000")
        @NotNull
        Integer fee,
        @Schema(description = "임대 기간(월)", example = "24")
        @NotNull
        Byte period,
        @Schema(description = "층", example = "5")
        @NotNull
        Byte floor,
        @Schema(description = "방향(N,S,W,E,NE,NW,SE,SW)", example = "S")
        @NotNull
        Facing facing,
        @Schema(description = "방 갯수", example = "4")
        @NotNull
        Byte roomCnt,
        @Schema(description = "화장실 갯수", example = "2")
        @NotNull
        Byte bathroomCnt,
        @Schema(description = "건물 건축일", example = "2010-01-01")
        @NotNull
        String constructionDate,
        @Schema(description = "주차 가능 대수", example = "2")
        @NotNull
        Byte parkingCnt,
        @Schema(description = "엘리베이터 여부", example = "true")
        @NotNull
        Boolean hasElevator,
        @Schema(description = "반려동물 가능 여부", example = "true")
        @NotNull
        Boolean petAvailable,
        @Schema(description = "경매 여부", example = "true")
        @NotNull
        Boolean isAucPref,
        @Schema(description = "중개인 여부", example = "true")
        @NotNull
        Boolean isBrkPref,
        @Schema(description = "경매 일자", example = "2025-12-12")
        LocalDateTime aucAt,
        @Schema(description = "경매 가능 일시", example = "2025-12-12")
        String aucAvailable,

        //AI 관련
        @Schema(description = "pdf 코드", example = "sfdsfsf")
        @NotNull
        String pdfCode,
        @Schema(description = "등기부등본 검증 여부", example = "true")
        @NotNull
        boolean isCertificated,
        @Schema(description = "등기부등본 검증 점수", example = "86")
        @NotNull
        Integer riskScore,
        @Schema(description = "등기부등본 검증 설명", example = "근저당이 없습니다.")
        @NotNull
        String riskReason
) {
}
