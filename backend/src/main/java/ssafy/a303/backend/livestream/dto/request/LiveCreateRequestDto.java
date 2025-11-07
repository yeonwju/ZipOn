package ssafy.a303.backend.livestream.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 라이브 방송 생성 요청 DTO
 * */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LiveCreateRequestDto {

    @Schema(description = "경매 식별자", example = "1")
    @NotNull
    private Integer auctionSeq;

    @Schema(description = "방송 제목", example = "강남역 오피스텔 라이브 경매")
    @NotBlank
    private String title;

}
