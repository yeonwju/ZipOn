package ssafy.a303.backend.mypage.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import ssafy.a303.backend.auction.entity.AuctionStatus;
import ssafy.a303.backend.property.enums.Building;

/**
 * 내 중개 내역 응답 DTO
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MyBrokerResponseDto {

    @Schema(description = "매물 썸네일 이미지", example = "https://s3.amazonaws.com/bucket/thumbnail.jpg")
    private String thumbnail;

    @Schema(description = "매물 식별자", example="1")
    private Integer propertySeq;

    @Schema(description = "경매 식별자", example="1")
    private Integer auctionSeq;

    @Schema(description = "중개 신청 상태", example="REQUESTED")
    private AuctionStatus auctionStatus;

    @Schema(description = "매물 타입", example = "ROOM")
    private Building buildingType;

    @Schema(description = "매물 주소", example = "송도 더샵하버뷰 1202동 804호")
    private String address;

    @Schema(description = "보증금", example = "5000")
    private Integer deposit;

    @Schema(description = "월세", example = "80")
    private Integer mnRent;

}
