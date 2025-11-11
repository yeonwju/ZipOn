package ssafy.a303.backend.broker.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ssafy.a303.backend.broker.dto.request.CompanyStatusRequest;
import ssafy.a303.backend.broker.service.CompanyService;
import ssafy.a303.backend.common.exception.CustomException;
import ssafy.a303.backend.common.response.ErrorCode;
import ssafy.a303.backend.common.response.ResponseDTO;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/company")
@Tag(name = "Broker", description = "중개사 등록 관련 API")
public class CompanyController {

    private final CompanyService companyService;

    @Operation(
            summary = "중개사 등록 요청",
            description = "로그인한 사용자가 사업자등록번호를 통해 중개사 등록을 신청합니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "중개사 등록 요청 접수 성공"),
            @ApiResponse(responseCode = "400", description = "요청 데이터 형식 또는 값이 올바르지 않음"),
            @ApiResponse(responseCode = "401", description = "인증 실패: 토큰이 없거나 유효하지 않음"),
            @ApiResponse(responseCode = "404", description = "유효하지 않은 사업자등록번호"),
            @ApiResponse(responseCode = "403", description = "본인 인증이 완료되지 않은 사용자")
    })
    @PostMapping("/status")
    public ResponseEntity<ResponseDTO<Void>> companyStatusCheck(@RequestBody CompanyStatusRequest companyRequest) {
        String taxSeq = companyRequest.b_no().get(0);
        if (companyService.checkCompany(taxSeq).getStatus()) {
            return ResponseDTO.ok(null, "운영 중인 사업장 입니다.");
        }
        throw new CustomException(ErrorCode.INVALID_TAX_SEQ);
    }
}
