package ssafy.a303.backend.contract.dto.common;

public record ResponseHeader(
        String responseCode,
        String responseMessage,
        String apiName,
        String transmissionDate,
        String transmissionTime,
        String institutionCode,
        String fintechAppNo,
        String apiServiceCode,
        String institutionTransactionUniqueNo
) {
}
