package ssafy.a303.backend.property.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ssafy.a303.backend.common.dto.ResponseDTO;
import ssafy.a303.backend.property.dto.request.PropertyAddressRequestDto;
import ssafy.a303.backend.property.dto.request.PropertyDetailRequestDto;
import ssafy.a303.backend.property.dto.request.VerifyRequestDto;
import ssafy.a303.backend.property.dto.response.PropertyAddressResponseDto;
import ssafy.a303.backend.property.service.PropertyService;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/properties")
@RequiredArgsConstructor
public class PropertyController {

    private final PropertyService propertyService;

    /**
     * 매물 주소 등록
     * @param req
     * @param userSeq
     * @return
     */
    @PostMapping("/address")
    public ResponseEntity<ResponseDTO<PropertyAddressResponseDto>> submitAddress(
            @RequestBody PropertyAddressRequestDto req,
            @AuthenticationPrincipal Integer userSeq
            ){

        PropertyAddressResponseDto response =
                propertyService.submitAddress(req, userSeq, req.lessorNm());

        return ResponseDTO.created(response, "매물이 성공적으로 등록되었습니다.");
    }

    /**
     * 등기부등본 등록 API
     * @param propertySeq
     * @param file
     * @param userSeq
     * @return
     */
    @PostMapping("/certificates")
    public ResponseEntity<Map<String, Object>> uploadCertificate(
            @PathVariable Integer propertySeq,
            @RequestPart("file")MultipartFile file,
            @AuthenticationPrincipal Integer userSeq

    ) {
        String url = propertyService.uploadCertificatePdf(propertySeq, userSeq, file);

        //-------------나머지
    }

    /**
     * 등기부등본 검증 여부 확인
     * @param propertySeq
     * @param req
     * @param userSeq
     * @return
     */
    @PostMapping("/{propertySeq}/verify")
    public ResponseEntity<Map<String, Object>> verifyCertificate(
            @PathVariable Integer propertySeq,
            @RequestBody VerifyRequestDto req,
            @AuthenticationPrincipal Integer userSeq
    ) {
        propertyService.verifyCertificate(propertySeq, userSeq, req.isCertificated());


    }

    @PatchMapping("/{propertySeq}/details")
    public ResponseEntity<ResponseDTO<Void>> submitDetail(@PathVariable Integer propertySeq,
                                                            @RequestBody PropertyDetailRequestDto req,
                                                            @AuthenticationPrincipal Integer userSeq)
    {
        propertyService.submitPropertyDetail(propertySeq, userSeq, req);
        return ResponseDTO.ok(null, "매물 상세 정보가 등록되었습니다.");
    }


}
