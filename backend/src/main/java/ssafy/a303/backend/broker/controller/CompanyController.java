package ssafy.a303.backend.broker.controller;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
        if (companyService.cmpStatus(taxSeq)) {
            return ResponseDTO.ok(null, "운영 중인 사업장 입니다.");
        }
        throw new CustomException(ErrorCode.INVALID_TAX_SEQ);
    }
}
