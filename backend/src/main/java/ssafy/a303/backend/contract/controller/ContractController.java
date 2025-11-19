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
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ssafy.a303.backend.common.response.ResponseDTO;
import ssafy.a303.backend.contract.dto.response.AiRawResponseDto;
import ssafy.a303.backend.contract.dto.response.ContractAiResponseDto;
import ssafy.a303.backend.contract.dto.response.CreateVirtualAccountResponseDto;
import ssafy.a303.backend.contract.service.ContractAiService;
import ssafy.a303.backend.contract.service.ContractService;
import ssafy.a303.backend.contract.util.ContractTextFormatter;

@Tag(name = "계약")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/contracts")
public class ContractController {

    private final ContractAiService aiService;
    private final ContractService contractService;

    /**
     * 계약 진행 시작 -> 가상계좌 생성
     *
     * @param contractSeq
     * @param userSeq
     * @return
     */
    @Operation(
            summary = "계약 진행 시작 -> 가상계좌 생성",
            description = "낙찰된 임차인이 계약 진행을 선택하면 가상계좌가 생성됩니다."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "가상계좌 생성 완료",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = CreateVirtualAccountResponseDto.class),
                            examples = @ExampleObject(
                                    name = "성공 응답 예시",
                                    value = """
                                                    {
                                                            "data": {
                                                                 "bankCode": "001",
                                                                 "accountNo": "0014017728828339",
                                                                 "targetAmount": 60000
                                                           },
                                                           "message": "계약 진행 및 가상계좌 생성 완료",
                                                           "status": 200,
                                                           "timestamp": 1763341593738
                                                    }
                                            """
                            )
                    )
            )
    })
    @PostMapping("/{contractSeq}/init")
    public ResponseEntity<ResponseDTO<CreateVirtualAccountResponseDto>> initContract(@PathVariable Integer contractSeq,
                                                                                     @AuthenticationPrincipal Integer userSeq) {
        CreateVirtualAccountResponseDto res = contractService.startContractAndCreateVA(contractSeq, userSeq);

        return ResponseDTO.ok(res, "계약 진행 및 가상계좌 생성 완료");
    }

    /**
     * 계약서 AI 검증
     *
     * @param file
     * @return
     */
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
                                                        "lines": ["첫번째 문장.", "두번째 문장", "세번째 문장"]
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
    public ResponseEntity<ResponseDTO<ContractAiResponseDto>> verifyContract(@RequestPart("file") MultipartFile file) {
        // AI 평가 받기
        AiRawResponseDto raw = aiService.verifyByAi(file);
        // 문단을 문장 단위로 나누기
        ContractAiResponseDto lines = ContractTextFormatter.splitToLines(raw.getReviews());
        // 프로트로 배열로 전달
        return ResponseDTO.ok(lines, "계약서 검증 결과입니다.");

    }

    // 문장 split 테스트
    @GetMapping("/test")
    public ResponseEntity<ResponseDTO<ContractAiResponseDto>> test() {
        String test = "이것도 분리가 되나요. ai가 되야되는데 말이죠. 왜 안될까요.";
        ContractAiResponseDto result = ContractTextFormatter.splitToLines(test);
        return ResponseDTO.ok(result, "테스트 결과입니다.");
    }

    /**
     * 첫 달 월세 납부
     *
     * @param contractSeq
     * @param userSeq
     * @return
     */
    @Operation(
            summary = "첫 달 월세 납부",
            description = "생성된 가상계좌로 첫달 월세를 납부합니다."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "첫 월세 납부 완료",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = Void.class),
                            examples = @ExampleObject(
                                    name = "성공 응답 예시",
                                    value = """
                                                    {
                                                            "message": "첫 월세 이체가 완료되었습니다.",
                                                            "status": 200,
                                                            "timestamp": 1763343554518
                                                    }
                                            """
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "사용자 계좌나 가상 계좌를 찾을 수 없습니다.",
                    content = @Content()
            )
    })
    @PostMapping("/{contractSeq}/first-rent")
    public ResponseEntity<ResponseDTO<Void>> payFirstRent(@PathVariable Integer contractSeq,
                                                          @AuthenticationPrincipal Integer userSeq) {
        contractService.payFirstRent(contractSeq, userSeq);
        return ResponseDTO.ok(null, "첫 월세 이체가 완료되었습니다.");
    }

    /**
     * 임대인에게 첫월세 전달 -> 계약 성사
     * @param contractSeq
     * @param userSeq
     * @return
     */
    @Operation(
            summary = "임대인에게 첫월세 전달 -> 계약 성사",
            description = "임대인에게 가상계좌 속 첫 월세를 전달합니다."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "첫월세 임대인에게 전달 완료",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = Void.class),
                            examples = @ExampleObject(
                                    name = "성공 응답 예시",
                                    value = """
                                                    {
                                                         "message": "임대인에게 첫 월세가 전달되었습니다.",
                                                         "status": 200,
                                                         "timestamp": 1763344376379
                                                     }
                                            """
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "db에서 관련 정보를 찾을 수 없습니다",
                    content = @Content()
            )
    })
    @PostMapping("/{contractSeq}/settlement")
    public ResponseEntity<ResponseDTO<Void>> settleContract(@PathVariable Integer contractSeq,
                                                            @AuthenticationPrincipal Integer userSeq) {
        contractService.acceptContractAndSettle(contractSeq, userSeq);
        return ResponseDTO.ok(null, "임대인에게 첫 월세가 전달되었습니다.");
    }




}
