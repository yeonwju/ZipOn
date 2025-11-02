package ssafy.a303.backend.broker.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import ssafy.a303.backend.broker.dto.request.CompanyStatusRequest;
import ssafy.a303.backend.broker.service.CompanyService;
import ssafy.a303.backend.common.exception.CustomException;
import ssafy.a303.backend.common.response.ErrorCode;
import ssafy.a303.backend.common.response.ResponseDTO;
import ssafy.a303.backend.security.jwt.service.JWTProvider;
import ssafy.a303.backend.security.jwt.token.InstantData;
import ssafy.a303.backend.security.support.CookieFactory;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/company")
public class CompanyController {

    CookieFactory cookieFactory;
    JWTProvider jwtProvider;

    private final CompanyService companyService;
    @PostMapping("/verify")
    public ResponseEntity<ResponseDTO<Void>> verifyCompany(@RequestBody CompanyStatusRequest companyRequest, HttpServletResponse response, @AuthenticationPrincipal Integer userSeq){
        CompanyStatusRequest.Business company = companyRequest.businesses().get(0);
        if(companyService.validateCompany(company.b_no(), company.start_dt(), company.p_nm())){
            String token = jwtProvider.generateInstantToken(
                    InstantData.builder()
                            .userSeq(userSeq)
                            .ceo(company.p_nm())
                            .taxSeq(company.b_no())
                            .build()
            );
            response.addCookie(cookieFactory.instantCookie("CP", token));
            return ResponseDTO.ok(null, "운영 중인 사업장 입니다.");
        } throw new CustomException(ErrorCode.INVALID_TAX_SEQ);
    }
}
