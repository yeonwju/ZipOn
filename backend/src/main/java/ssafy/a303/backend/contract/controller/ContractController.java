package ssafy.a303.backend.contract.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ssafy.a303.backend.common.response.ResponseDTO;
import ssafy.a303.backend.contract.dto.response.AiRawResponseDto;
import ssafy.a303.backend.contract.dto.response.ContractAiResponseDto;
import ssafy.a303.backend.contract.service.ContractAiService;
import ssafy.a303.backend.contract.util.ContractTextFormatter;
import ssafy.a303.backend.property.dto.response.PropertyMapDto;

import java.awt.*;

@Tag(name = "계약")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/contracts")
public class ContractController {

    private final ContractAiService aiService;

    @Operation(
            summary = "계약서 ai 검증",
            description = "계약서의 독소조항 여부를 ai로 검증합니다."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "ai 검증 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ContractAiResponseDto.class),
                            examples = @ExampleObject(
                                    name = "성공 응답 예시",
                                    value = """
                                            {
                                              "data": {
                                                "lines": []
                                              },
                                              "message": "계약서 검증 결과입니다.",
                                              "status": 200,
                                              "timestamp": 1763130506609
                                            }
                                    """
                            )
                    )
            )
    })
    @PostMapping(value = "/verify", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResponseDTO<ContractAiResponseDto>> verifyContract(@RequestPart("file") MultipartFile file)
    {
        // AI 평가 받기
        AiRawResponseDto rawResult = aiService.verifyByAi(file);
        // 문단을 문장 단위로 나누기
        ContractAiResponseDto lines = ContractTextFormatter.splitToLines(rawResult.getRawLine());
        // 프로트로 배열로 전달
        return ResponseDTO.ok(lines,"계약서 검증 결과입니다.");

    }

    // 문장 split 테스트
    @GetMapping("/test")
    public ResponseEntity<ResponseDTO<ContractAiResponseDto>> test() {

        String test = "이것도 분리가 되나요. ai가 되야되는데 말이죠. 왜 안될까요.";
        ContractAiResponseDto result = ContractTextFormatter.splitToLines(test);

        return ResponseDTO.ok(result, "테스트 결과입니다.");
    }
}
