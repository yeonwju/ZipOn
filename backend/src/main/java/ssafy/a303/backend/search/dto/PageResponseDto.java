package ssafy.a303.backend.search.dto;

import java.util.List;

public record PageResponseDto<T>(
        long total,
        int page,
        int size,
        List<T> items
) {
}
