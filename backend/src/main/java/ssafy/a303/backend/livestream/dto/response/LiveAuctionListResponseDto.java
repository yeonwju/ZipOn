package ssafy.a303.backend.livestream.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 라이브 방송 생성을 위한 경매 리스트
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LiveAuctionListResponseDto {

    @Schema(description = "경매 식별자", example = "1")
    @NotNull
    private Integer auctionSeq;

    @Schema(description = "매물 식별자", example = "1")
    @NotNull
    private Integer propertySeq;

    @Schema(description = "매물 이름", example = "힐스테이트 35평")
    @NotNull
    private String propertyNm;

}
