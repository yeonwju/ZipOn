package ssafy.a303.backend.property.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
//import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ssafy.a303.backend.common.dto.ResponseDTO;
import ssafy.a303.backend.property.dto.request.PropertyAddressRequestDto;
import ssafy.a303.backend.property.dto.request.PropertyDetailRequestDto;
import ssafy.a303.backend.property.dto.request.PropertyUpdateRequestDto;
import ssafy.a303.backend.property.dto.request.VerifyRequestDto;
import ssafy.a303.backend.property.dto.response.DetailResponseDto;
import ssafy.a303.backend.property.dto.response.PropertyAddressResponseDto;
import ssafy.a303.backend.property.dto.response.PropertyMapDto;
import ssafy.a303.backend.property.dto.response.PropertyUpdateResponseDto;
import ssafy.a303.backend.property.service.PropertyService;

import java.util.List;
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
    public ResponseEntity<ResponseDTO<PropertyAddressResponseDto>> submitAddress(@RequestBody PropertyAddressRequestDto req,
                                                                                 //@AuthenticationPrincipal Integer userSeq
                                                                                @RequestParam Integer userSeq)
    {
        PropertyAddressResponseDto response = propertyService.submitAddress(req, userSeq);

        return ResponseDTO.created(response, "매물이 성공적으로 등록되었습니다.");
    }

//    /**
//     * 등기부등본 등록 API
//     * @param propertySeq
//     * @param file
//     * @param userSeq
//     * @return
//     */
//    @PostMapping("/certificates")
//    public ResponseEntity<Map<String, Object>> uploadCertificate(
//            @PathVariable Integer propertySeq,
//            @RequestPart("file")MultipartFile file,
//            @AuthenticationPrincipal Integer userSeq
//
//    ) {
//        String url = propertyService.uploadCertificatePdf(propertySeq, userSeq, file);
//
//        //-------------나머지
//    }
//
//    /**
//     * 등기부등본 검증 여부 확인
//     * @param propertySeq
//     * @param req
//     * @param userSeq
//     * @return
//     */
//    @PostMapping("/{propertySeq}/verify")
//    public ResponseEntity<Map<String, Object>> verifyCertificate(
//            @PathVariable Integer propertySeq,
//            @RequestBody VerifyRequestDto req,
//            @AuthenticationPrincipal Integer userSeq
//    ) {
//        propertyService.verifyCertificate(propertySeq, userSeq, req.isCertificated());
//    }

    /**
     * 매물 상세 정보 등록
     * @param propertySeq
     * @param req
     * @param userSeq
     * @return
     */
    @PatchMapping("/{propertySeq}/details")
    public ResponseEntity<ResponseDTO<Void>> submitPropertyDetail(@PathVariable Integer propertySeq,
                                                            @RequestBody PropertyDetailRequestDto req,
//                                                            @AuthenticationPrincipal Integer userSeq
                                                            @RequestParam Integer userSeq)
    {
        propertyService.submitPropertyDetail(propertySeq, userSeq, req);
        return ResponseDTO.ok(null, "매물 상세 정보가 등록되었습니다.");
    }

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
    public ResponseEntity<ResponseDTO<List<PropertyMapDto>>> getMap(@RequestParam(required = false) Integer minLat,
                                                                    @RequestParam(required = false) Integer maxLat,
                                                                    @RequestParam(required = false) Integer minLng,
                                                                    @RequestParam(required = false) Integer maxLng)
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
