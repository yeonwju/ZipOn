package ssafy.a303.backend.auction.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

public record WinnerAcceptDTO (
        @Schema(description = "생성된 계약 SEQ", example = "123")
        int contractSeq
) {
}
