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
@Tag(name = "Company", description = "사업자 상태 조회 API")
public class CompanyController {

    private final CompanyService companyService;
    @Operation(
            summary = "사업자 상태 조회",
            description = "사업자등록번호를 전달받아 운영 중인 사업장인지 확인합니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "운영 중인 사업장"),
            @ApiResponse(responseCode = "400", description = "요청 값이 잘못되었거나 형식 오류"),
            @ApiResponse(responseCode = "404", description = "운영 중인 사업장이 아님 또는 존재하지 않음"),
            @ApiResponse(responseCode = "429", description = "외부 API 일일 호출 제한 초과"),
            @ApiResponse(responseCode = "502", description = "외부 API 연동 오류")
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
