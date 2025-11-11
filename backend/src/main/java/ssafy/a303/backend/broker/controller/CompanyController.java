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

public class CompanyController {

    private final CompanyService companyService;
    @PostMapping("/status")
    public ResponseEntity<ResponseDTO<Void>> companyStatusCheck(@RequestBody CompanyStatusRequest companyRequest) {
        String taxSeq = companyRequest.b_no().get(0);
        if (companyService.checkCompany(taxSeq).getStatus()) {
            return ResponseDTO.ok(null, "운영 중인 사업장 입니다.");
        }
        throw new CustomException(ErrorCode.INVALID_TAX_SEQ);
    }
}
