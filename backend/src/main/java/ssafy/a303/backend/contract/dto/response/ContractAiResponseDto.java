package ssafy.a303.backend.contract.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class ContractAiResponseDto {
    @Schema(description = "계약서 검증 내용. 문장 리스트.")
    List<String> lines;
}
