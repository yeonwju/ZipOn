package ssafy.a303.backend.broker.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "중개사 등록 요청 시 사용하는 사업자등록번호 요청 DTO")
public record TaxSeqRequest (
        @Schema(description = "사업자등록번호(숫자만)", example = "1234567890")
        String taxSeq
){}
