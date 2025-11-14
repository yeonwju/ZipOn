package ssafy.a303.backend.contract.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class ContractAiResponseDto {
    List<String> lines;
}
