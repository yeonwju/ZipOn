package ssafy.a303.backend.contract.dto.response;

import ssafy.a303.backend.contract.dto.common.CreateRes;
import ssafy.a303.backend.contract.dto.common.ResponseHeader;

public record CreateVirtualAccountResponseDto(
        String bankCode,     // 은행 코드
        String accountNo,    // 계좌번호
        Integer targetAmount // 첫 월세(처음 입금해야 하는 금액)
) {
}
