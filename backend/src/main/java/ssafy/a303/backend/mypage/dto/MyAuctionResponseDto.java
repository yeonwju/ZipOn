package ssafy.a303.backend.mypage.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import ssafy.a303.backend.auction.entity.BidStatus;

/**
 * 경매 참여 내역 응답 DTO
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MyAuctionResponseDto {

    @Schema(description = "경매 매물 썸네일 이미지", example = "https://s3.amazonaws.com/bucket/thumbnail.jpg")
    private String thumbnail;

    @Schema(description = "경매 식별자", example="1")
    private Long auctionSeq;

    @Schema(description = "매물 식별자", example="1")
    private Long propertySeq;

    @Schema(description = "경매 진행 상태", example = "WAITING")
    private BidStatus bidStatus;

    @Schema(description = "경매 주소", example = "송도 더샵하버뷰 1202동 804호")
    private String address;

    @Schema(description = "내 입찰가", example = "125000000")
    private int bidAmount;

    @Schema(description = "경매 입찰 순위", example = "2")
    private int bidRank;

}
