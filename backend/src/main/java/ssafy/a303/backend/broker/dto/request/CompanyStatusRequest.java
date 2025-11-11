package ssafy.a303.backend.broker.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.Arrays;
import java.util.List;

@Schema(description = "사업자 상태 조회 요청 DTO (국세청/정부 API 형식)")
public record CompanyStatusRequest(
        @Schema(
                description = "조회할 사업자등록번호 목록(숫자만). 외부 API 사양에 맞춰 배열로 전달.",
                example = "[\"1234567890\"]"
        )
        List<String> b_no
) {

    public static CompanyStatusRequest of(String... taxSeqs) {
        return new CompanyStatusRequest(Arrays.asList(taxSeqs));
    }
}
