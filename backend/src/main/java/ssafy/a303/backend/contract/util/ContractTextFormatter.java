package ssafy.a303.backend.contract.util;

import ssafy.a303.backend.contract.dto.response.ContractAiResponseDto;

import java.util.Arrays;
import java.util.List;

public class ContractTextFormatter {
    public static ContractAiResponseDto splitToLines(String raw) {
        if (raw == null || raw.isBlank()) {
            return new ContractAiResponseDto(List.of());
        }

        // 줄바꿈 기준으로 나누기
        String[] lines = raw.split("\\r?\\n");

        List<String> cleaned = Arrays.stream(lines)
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .toList();

        return new ContractAiResponseDto(cleaned);
    }
}
