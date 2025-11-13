package ssafy.a303.backend.auction.dto.response;

import ssafy.a303.backend.auction.entity.Auction;

import java.time.LocalDateTime;

public record BrkCancelResponseDto(
        Integer auctionSeq,
        Integer propertySeq,
        Integer userSeq,
        String status,
        LocalDateTime cancelAt,
        String cancelBy,
        String cancelReason
) {
    public static BrkCancelResponseDto of(Auction a) {
        return new BrkCancelResponseDto(
                a.getAuctionSeq(),
                a.getProperty().getPropertySeq(),
                a.getUser().getUserSeq(),
                a.getStatus().name(),
                a.getCancelAt(),
                a.getCancelBy() != null ? a.getCancelBy().name() : null,
                a.getCancelReason()
        );
    }
}
