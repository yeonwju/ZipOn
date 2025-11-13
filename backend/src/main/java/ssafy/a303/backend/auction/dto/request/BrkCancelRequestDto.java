package ssafy.a303.backend.auction.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

public record BrkCancelRequestDto(
        @Schema(description = "취소 사유", defaultValue = "그냥 싫어요")
        String reason
) {
}
