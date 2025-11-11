package ssafy.a303.backend.property.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import org.jetbrains.annotations.NotNull;


public record PropertyAddressRequestDto(
        @Schema(description = "임대인 이름", example = "김싸피")
        @NotNull
        String lessorNm,
        @Schema(description = "매물 이름", example = "멀티캠퍼스")
        @NotNull
        String propertyNm,
        @Schema(description = "주소", example = "서울특별시 강남구 테헤란로 42-232")
        @NotNull
        String address,
        @Schema(description = "위도", example = "12.945387")
        @NotNull
        Double latitude,
        @Schema(description = "경도", example = "78.658784")
        @NotNull
        Double longitude
) {}
