package ssafy.a303.backend.contract.dto.common;

public record RequestHeader(
        String apiName,
        String transmissionDate,
        String transmissionTime,
        String institutionCode,
        String fintechAppNo,
        String apiServiceCode,
        String institutionTransactionUniqueNo,
        String apiKey,
        String userKey
) {
}
