package ssafy.a303.backend.contract.dto.response;

import ssafy.a303.backend.contract.dto.common.CreateRes;
import ssafy.a303.backend.contract.dto.common.ResponseHeader;

public record CreateVirtualAccountResponseDto(
        ResponseHeader Header,
        CreateRes REC
) {
}
