package ssafy.a303.backend.property.dto.response;

import lombok.Data;

public record ImageDto(
        String s3key,
        String url,
        Integer order
) {
}
