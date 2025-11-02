package ssafy.a303.backend.broker.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
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
    @PostMapping("/verify")
    public ResponseEntity<ResponseDTO<Void>> verifyCompany(@RequestBody CompanyStatusRequest request){
        CompanyStatusRequest.Business company = request.businesses().get(0);
        if(companyService.validateCompany(company.b_no(), company.start_dt(), company.p_nm())){
            return ResponseDTO.ok(null, "운영 중인 사업장 입니다.");
        } throw new CustomException(ErrorCode.INVALID_TAX_SEQ);
    }
}
