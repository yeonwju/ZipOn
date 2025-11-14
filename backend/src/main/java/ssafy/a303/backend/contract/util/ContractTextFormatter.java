package ssafy.a303.backend.contract.util;

import ssafy.a303.backend.contract.dto.response.ContractAiResponseDto;

import java.util.Arrays;
import java.util.List;

public class ContractTextFormatter {
    public static ContractAiResponseDto splitToLines(String raw) {
        if (raw == null || raw.isBlank()) {
            return new ContractAiResponseDto(List.of());
        }

        List<String> lines = Arrays.stream(raw.split("\\r?\\n"))
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .toList();

        return new ContractAiResponseDto(lines);
    }
}
