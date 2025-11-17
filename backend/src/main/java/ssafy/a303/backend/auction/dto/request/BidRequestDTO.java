package ssafy.a303.backend.auction.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "경매 입찰 요청 DTO")
public record BidRequestDTO(
        @Schema(description = "입찰할 경매 번호", example = "123")
        int auctionSeq,
        @Schema(description = "입찰 금액(원 단위, 최대 21억 미만)", example = "500000")
        long amount
) {
}
