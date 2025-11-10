package ssafy.a303.backend.property.dto.request;

import lombok.Data;

@Data
public record VerifyRequestDto(
        String regiNm,
        String regiBirth,
        String address
) {
}
