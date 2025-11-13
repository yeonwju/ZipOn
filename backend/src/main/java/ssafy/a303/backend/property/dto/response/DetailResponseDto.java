package ssafy.a303.backend.property.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import org.jetbrains.annotations.NotNull;
import ssafy.a303.backend.property.enums.Building;
import ssafy.a303.backend.property.enums.Facing;

import java.time.LocalDateTime;
import java.util.List;

public record DetailResponseDto(
        // 유저 사진, seq
        @Schema(description = "임대인의 user seq", example = "2")
        Integer lessorSeq,
        @Schema(description = "임대인의 프로필 사진", example = "assfasfas")
        String lessorProfileImg,

        @Schema(description = "라이브 시작 날짜와 시간", example = "1212-12-12 12:12:12")
        LocalDateTime liveAt,
        @Schema(description = "중개인의 user seq", example = "1")
        Integer brkSeq,

        //기본 정보
        @Schema(description = "매물 seq", example = "1")
        @NotNull
        Integer propertySeq,
        @Schema(description = "임대인 이름", example = "김싸피")
        String lessorNm,
        @Schema(description = "매물 이름", example = "멀티캠퍼스")
        String propertyNm,
        @Schema(description = "매물 설명", example = "위치도 좋고 따뜻해서 살기 좋아요")
        String content,

        // 주소 좌표
        @Schema(description = "주소", example = "서울특별시 강남구 테헤란로 42-232")
        String address,
        @Schema(description = "위도", example = "12.945387")
        Double latitude,
        @Schema(description = "경도", example = "78.658784")
        Double longitude,
        @Schema(description = "빌딩 타입", example = "OFFICE")
        Building buildingType,

        //면적
        @Schema(description = "면적 m^2", example = "109.7")
        Double area,
        @Schema(description = "평수", example = "42")
        Integer areaP,

        //금액
        @Schema(description = "보증금", example = "50000000")
        Long deposit,
        @Schema(description = "월세", example = "800000")
        Integer mnRent,
        @Schema(description = "관리비", example = "150000")
        Integer fee,

        //사진 리스트로 s3 주소 보내줘야 함.
        @Schema(description = "매물 사진들", example = "[www.jlsfj,slfkjsdl, www.dkfjls.sdjfklsd]")
        List<ImageDto> images,

        // 상세 스펙
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

        // 경매, 중개 선호 설정
        @Schema(description = "경매 여부", example = "true")
        Boolean isAucPref,
        @Schema(description = "중개인 여부", example = "true")
        Boolean isBrkPref,

        // 중개 성사 여부
        @Schema(description = "중개 성사 여부", example = "true")
        Boolean hasBrk,

        // 경매 관련
        @Schema(description = "경매 일자", example = "2025-12-12")
        String aucAt,
        @Schema(description = "경매 가능 일시", example = "2025-12-12")
        String aucAvailable,

        //ai 관련
        @Schema(description = "pdf 코드", example = "sfdsfsf")
        String pdfCode,
        @Schema(description = "등기부등본 검증 여부", example = "true")
        boolean isCertificated,
        @Schema(description = "등기부등본 검증 점수", example = "86")
        Integer riskScore,
        @Schema(description = "등기부등본 검증 설명", example = "근저당이 없습니다.")
        String riskReason
) {
}
