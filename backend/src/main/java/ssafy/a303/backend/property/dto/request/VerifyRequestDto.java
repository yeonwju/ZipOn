package ssafy.a303.backend.property.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import org.jetbrains.annotations.NotNull;

public record VerifyRequestDto(
        @Schema(description = "시스템 등록된 이름", example = "김싸피")
        @NotNull
        String regiNm,
        @Schema(description = "시스템 등록 생일", example = "2020-01-01")
        @NotNull
        String regiBirth,
        @Schema(description = "주소", example = "서울특별시 강남구 테헤란로 42-232")
        @NotNull
        String address
) {
}
