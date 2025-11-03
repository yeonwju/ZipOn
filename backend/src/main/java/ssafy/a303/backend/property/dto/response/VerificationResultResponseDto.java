package ssafy.a303.backend.property.dto.response;

public record VerificationResultResponseDto(
        String pdfCode,
        boolean isCertificated
) {
}
