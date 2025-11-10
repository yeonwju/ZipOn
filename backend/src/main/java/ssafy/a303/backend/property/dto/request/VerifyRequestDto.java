package ssafy.a303.backend.property.dto.request;

public record VerifyRequestDto(
        String regiNm,
        String regiBirth,
        String address
) {
}
