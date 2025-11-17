package ssafy.a303.backend.contract.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import ssafy.a303.backend.contract.dto.common.CreateRes;
import ssafy.a303.backend.contract.dto.common.ResponseHeader;

public record CreateVirtualAccountResponseDto(
        @Schema(description = "은행코드", example = "001")
        String bankCode,     // 은행 코드
        @Schema(description = "계좌번호", example = "0014017728828339")
        String accountNo,    // 계좌번호
        @Schema(description = "첫 월세", example = "1000000")
        Integer targetAmount // 첫 월세(처음 입금해야 하는 금액)
) {
}
