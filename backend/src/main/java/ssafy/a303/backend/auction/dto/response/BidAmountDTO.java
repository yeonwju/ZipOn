package ssafy.a303.backend.auction.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "내 입찰 금액 조회 응답 DTO")
public record BidAmountDTO(
        @Schema(description = "나의 입찰 금액", example = "1500000")
        int amount
) {
}
