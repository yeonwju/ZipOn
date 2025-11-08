package ssafy.a303.backend.search.dto;

import lombok.*;

/**
 * DB에서 가져온 엔티티를 ES가 이해할 구조로 변환해서 전달.
 * DB(엔티티)와 ES의 중간 계층.
 * 색인할 때 검색용으로 변환하는 단계에서 사용.
 */
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PropertyDocument {
    private String title;
    private String description;

    private String si;
    private String gu;
    private String dong;
    private String facing;
    private String lessorNm;
    private String buildingType; // ES keyword (예: "APT","VILLA"...)

    private Long deposit;
    private Integer mnRent;
    private Integer fee;
    private Double area;
    private Integer areaP;
    private Short roomCnt;
    private Short floor;

    private String createdAt;
}