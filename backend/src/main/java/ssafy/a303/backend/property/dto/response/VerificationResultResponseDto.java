package ssafy.a303.backend.property.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

public record VerificationResultResponseDto(
        @Schema(description = "pdf 고유 번호", example = "lklsdjsdfd")
        String pdfCode,
        @Schema(description = "검증 여부", example = "true")
        boolean isCertificated,
        @Schema(description = "검증 점수", example = "86")
        Integer riskScore,
        @Schema(description = "검증 설명", example = "근저당 적습니다.")
        String riskReason
) {
}
