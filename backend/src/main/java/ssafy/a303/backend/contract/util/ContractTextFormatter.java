package ssafy.a303.backend.contract.util;

import ssafy.a303.backend.contract.dto.response.ContractAiResponseDto;

import java.util.Arrays;
import java.util.List;

public class ContractTextFormatter {
    public static ContractAiResponseDto splitToLines(String raw) {
        if (raw == null || raw.isBlank()) {
            return new ContractAiResponseDto(List.of());
        }

        // 줄바꿈 기준 나누기
        String[] lineChunks = raw.split("\\r?\\n");

        List<String> lines = Arrays.stream(lineChunks)
                .flatMap(line -> Arrays.stream(
                        // 문장부호 기준으로 나누기
                        line.split("(?<=[.!?])\\s*")
                ))
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .toList();

        return new ContractAiResponseDto(lines);
    }
}
