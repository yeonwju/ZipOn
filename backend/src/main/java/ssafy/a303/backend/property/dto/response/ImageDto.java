package ssafy.a303.backend.property.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

public record ImageDto(
        @Schema(description = "이미지 s3 키", example = "lkjasfoejl")
        String s3key,
        @Schema(description = "s3 주소", example = "www.dfjkslfs.sdjflsafjk")
        String url,
        @Schema(description = "사진 순서", example = "1")
        Integer order
) {
}
