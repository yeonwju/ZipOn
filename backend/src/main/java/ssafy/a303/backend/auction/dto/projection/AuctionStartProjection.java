package ssafy.a303.backend.auction.dto.projection;

import java.time.LocalDateTime;

public interface AuctionStartProjection {
    int getAuctionSeq();
    LocalDateTime getAuctionEndAt();
}
