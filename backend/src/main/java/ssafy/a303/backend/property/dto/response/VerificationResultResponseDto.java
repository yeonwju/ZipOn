package ssafy.a303.backend.property.dto.response;

import lombok.Data;

public record VerificationResultResponseDto(
        String pdfCode,
        boolean isCertificated,
        Integer riskScore,
        String riskReason
) {
}
