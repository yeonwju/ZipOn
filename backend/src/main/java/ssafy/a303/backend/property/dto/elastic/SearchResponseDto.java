package ssafy.a303.backend.property.dto.elastic;

import ssafy.a303.backend.property.enums.Building;

import java.time.Instant;

public record SearchResponseDto(
        // search 결과 id
        String id,
        //매물 seq
        Integer propertySeq,
        //임대인 이름
        String lessorNm,
        // 매물 썸네일
        String thumbnail,
        // 매물 제목
        String title,
        // 매물 설명 앞부분이나 하이라이트 있다면
        String description,
        //빌딩 타입
        String buildingType,
        // 주소
        String address,
        // 보증금
        Long deposit,
        // 월세
        Integer mnRent,
        // 관리비
        Integer fee,
        // 면적
        Double area,
        // 평수
        Integer areaP,
        //방 갯수
        Short roomCnt,
        // 층
        Short floor,
        // 생성일
        Instant createdAt
) {
}
