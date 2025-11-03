package ssafy.a303.backend.property.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
//import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ssafy.a303.backend.common.dto.ResponseDTO;
import ssafy.a303.backend.property.dto.request.PropertyUpdateRequestDto;
import ssafy.a303.backend.property.dto.response.*;
import ssafy.a303.backend.property.service.PropertyService;
import ssafy.a303.backend.property.service.VerificationService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/properties")
@RequiredArgsConstructor
public class PropertyController {

    private final PropertyService propertyService;
    private final VerificationService verificationService;

    /**
     * 매물 검증
     * 1) 매물 주소 입력
     * 2) 등기부등본 업로드
     * 3) 이름, 생일, 주소 적합성 AI 판단
     * @param file
     * @param regiNm
     * @param regiBirth
     * @param address
     * @return
     */
    @PostMapping(value = "/verifications", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResponseDTO<VerificationResultResponseDto>> verifyPdf(@RequestParam("file")MultipartFile file,
                                                                                @RequestParam String regiNm,
                                                                                @RequestParam String regiBirth,
                                                                                @RequestParam String address)
    {
        VerificationResultResponseDto res = verificationService.verifyPdf(file, regiNm, regiBirth, address);
        return ResponseDTO.ok(res, "등기부등본이 인증되었습니다.");
    }

    /**
     * 매물 최종 등록
     * 4) 매물 상세 정보 입력
     * 5) 매물 최종 등록
     */



    /**
     * 매물 상세 정보 조회
     * @param propertySeq
     * @param userSeq
     * @return
     */
    @GetMapping("/{propertySeq}")
    public ResponseEntity<ResponseDTO<DetailResponseDto>> getPropertyDetail(@PathVariable Integer propertySeq,
//                                                       @AuthenticationPrincipal Integer userSeq,
                                                                            @RequestParam Integer userSeq)
    {
        DetailResponseDto response = propertyService.getPropertyDetail(propertySeq);
        return ResponseDTO.ok(response, "해당 매물의 상세 정보를 조회합니다.");
    }

    /**
     * 지도용 요약 위경도 정보 전체/부분 조회
     * @param minLat
     * @param maxLat
     * @param minLng
     * @param maxLng
     * @return
     */
    @GetMapping("/map")
    public ResponseEntity<ResponseDTO<List<PropertyMapDto>>> getMap(@RequestParam(required = false) Double minLat,
                                                                    @RequestParam(required = false) Double maxLat,
                                                                    @RequestParam(required = false) Double minLng,
                                                                    @RequestParam(required = false) Double maxLng)
    {
        List<PropertyMapDto> response = propertyService.getMapPoints(minLat, maxLat, minLng, maxLng);
        return ResponseDTO.ok(response, "매물 요약 정보와 위경도 정보 조회");
    }

    /**
     * 매물 정보 수정
     * @param propertySeq
     * @param req
     * @param userSeq
     * @return
     */
    @PatchMapping("/{propertySeq}")
    public ResponseEntity<ResponseDTO<PropertyUpdateResponseDto>> updateProperty(@PathVariable Integer propertySeq,
                                                                                 @RequestBody PropertyUpdateRequestDto req,
//                                                                                 @AuthenticationPrincipal Integer userSeq,
                                                                                 @RequestParam Integer userSeq)
    {
        PropertyUpdateResponseDto response = propertyService.updateProperty(propertySeq, req, userSeq);
        return ResponseDTO.ok(response,"매물 정보가 수정되었습니다.");
    }

    /**
     * 매물 삭제
     * @param propertySeq
     * @param userSeq
     * @return
     */
    @DeleteMapping("/{propertySeq}")
    public ResponseEntity<ResponseDTO<Void>> deleteProperty(@PathVariable Integer propertySeq,
//                                                            @AuthenticationPrincipal Integer userSeq,
                                                            @RequestParam Integer userSeq)
    {
        propertyService.deleteProperty(propertySeq, userSeq);
        return ResponseDTO.ok(null, "매물이 삭제되었습니다.");
    }

}
