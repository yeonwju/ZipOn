package ssafy.a303.backend.auction.kafka;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum Topic {
    AUCTION_BID("auction-bid"),
    ;
    private final String topic;
}
