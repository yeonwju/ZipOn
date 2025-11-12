package ssafy.a303.backend.auction.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import ssafy.a303.backend.auction.entity.Auction;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Builder
public record BrkApplyResponseDto(
        Integer auctionSeq,
        Integer propertySeq,
        Integer userSeq,
        String status,
        LocalDate strmDate,
        LocalTime strmStartTm,
        LocalTime strmEndTm,
        LocalDateTime auctionEndAt
) {
    public static BrkApplyResponseDto of(Auction a) {
        return new BrkApplyResponseDto(
                a.getAuctionSeq(),
                a.getProperty().getPropertySeq(),
                a.getUser().getUserSeq(),
                a.getStatus().name(),
                a.getStrmDate(),
                a.getStrmStartTm(),
                a.getStrmEndTm(),
                a.getAuctionEndAt()
        );
    }
}
