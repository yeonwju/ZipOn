package ssafy.a303.backend.property.dto.elastic;

import java.util.List;

public record SearchRequestDto(
        String q,                 // 검색어(없으면 match_all)
        String si,                // 선택: 시/도
        String gu,                // 선택: 구/군
        String dong,              // 선택: 동

        Long depositMin,          // 보증금 최소
        Long depositMax,          // 보증금 최대
        Integer mnRentMin,        // 월세 최소
        Integer mnRentMax,        // 월세 최대
        Integer feeMin,           // 관리비 최소
        Integer feeMax,           // 관리비 최대

        Double areaMin,           // 면적 최소
        Double areaMax,           // 면적 최대
        Short roomCountMin,       // 방 개수 최소
        Short roomCountMax,       // 방 개수 최대
        Short floorMin,           // 층 최소
        Short floorMax,           // 층 최대

        List<String> facings,     // 해방향(예: ["S","SE"]) - keyword
        List<String> buildingTypes,// 빌딩타입(예: ["OFFICE","APT"]) - keyword (매핑: building_type)

        Integer page,             // 0-base
        Integer size,             // 페이지 크기
        String sortField,         // 정렬 필드 (기본: created_at)
        String sortOrder          // asc|desc
) {
}
