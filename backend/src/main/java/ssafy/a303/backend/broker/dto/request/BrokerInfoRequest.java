package ssafy.a303.backend.broker.dto.request;

public record BrokerInfoRequest(
        String license,
        String taxSeq
) {
}
