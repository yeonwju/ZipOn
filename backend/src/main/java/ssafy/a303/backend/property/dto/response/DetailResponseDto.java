package ssafy.a303.backend.property.dto.response;

import lombok.Data;
import ssafy.a303.backend.property.enums.Facing;

import java.util.List;

@Data
public record DetailResponseDto(
        //기본 정보

        Integer propertySeq,
        String lessorNm,
        String propertyNm,
        String content,

        // 주소 좌표
        String address,
        Double latitude,
        Double longitude,

        //면적
        Double area,
        Integer areaP,

        //금액
        Long deposit,
        Integer mnRent,
        Integer fee,

        //사진 리스트로 s3 주소 보내줘야 함.
        List<ImageDto> images,

        // 상세 스펙
        Byte period,
        Byte floor,
        Facing facing,
        Byte roomCnt,
        Byte bathroomCnt,
        String constructionDate,
        Byte parkingCnt,
        Boolean hasElevator,
        Boolean petAvailable,

        // 경매, 중개 선호 설정
        Boolean isAucPref,
        Boolean isBrkPref,

        // 중개 성사 여부
        Boolean hasBrk,

        // 경매 관련
        String aucAt,
        String aucAvailable

) {
}
