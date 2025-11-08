package ssafy.a303.backend.search.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddressParts {
    private String si; // 시
    private String gu; // 군/구
    private String dong; // 읍/면/동
}
