package ssafy.a303.backend.property.dto.request;

import lombok.Data;

public record VerifyRequestDto(
        String regiNm,
        String regiBirth,
        String address
) {
}
