package ssafy.a303.backend.contract.dto.request;


import ssafy.a303.backend.contract.dto.common.RequestHeader;

public record CreateVirtualAccountRequestDto(
        RequestHeader Header,
        String accountTypeUniqueNo
        ) {
}
