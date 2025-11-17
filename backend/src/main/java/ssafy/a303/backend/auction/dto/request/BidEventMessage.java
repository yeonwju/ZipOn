package ssafy.a303.backend.auction.dto.request;

import ssafy.a303.backend.common.helper.KoreaClock;

import java.time.LocalDateTime;

public record BidEventMessage(
        Integer auctionSeq,
        Integer userSeq,
        Long amount,
        LocalDateTime bidAt
) {
    public static BidEventMessage of(Integer auctionSeq, Integer userSeq, Long amount) {
        LocalDateTime now = LocalDateTime.now(KoreaClock.getClock());
        return new BidEventMessage(auctionSeq, userSeq, amount, now);
    }
}
