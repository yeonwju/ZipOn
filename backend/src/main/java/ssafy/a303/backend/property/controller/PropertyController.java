package ssafy.a303.backend.property.controller;

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
import ssafy.a303.backend.property.dto.request.PropertyDetailRequestDto;
import ssafy.a303.backend.property.dto.request.PropertyUpdateRequestDto;
import ssafy.a303.backend.property.dto.response.*;
import ssafy.a303.backend.property.service.PropertyService;
import ssafy.a303.backend.property.service.VerificationService;

import java.util.List;

@Tag(name="매물")
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
    @Operation(
            summary = "주소 입력 및 등기부등본 검증",
            description = "매물의 주소를 입력하고 등기부등본을 검증합니다."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "등기부등본이 정상적으로 인증됨",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ResponseDTO.class),
                            examples = @ExampleObject(
                                    name = "성공 응답 예시",
                                    value = """
                                            {
                                                "data": {
                                                    "pdfCode": "비밀번호",
                                                    "verificationStatus": "PASSED",
                                                    "isCertificated": true,
                                                    "riskScore": 78,
                                                    "riskReason": "근저당이 있습니다."
                                                },
                                                "message": "매물이 성공적으로 등록되었습니다.",
                                                "status": 201,
                                                "timestamp": 1761720692891
                                            }
                                            """
                            )
                    )
            )
    })
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
    @Operation(
            summary = "매물 상세 정보 입력 후 최종등록",
            description = "매물의 상세 정보를 입력하고 최종적으로 매물을 등록합니다."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "매물 최종 등록",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ResponseDTO.class),
                            examples = @ExampleObject(
                                    name = "성공 응답 예시",
                                    value = """
                                            {
                                                 "data": {
                                                     "propertySeq": 1, //매물 고유 id 번호(integer)
                                                     "lessorNm": "김싸피",
                                                     "propertyNm": "멀티캠퍼",
                                                     "content": "이 집은 아주 좋습니다.",
                                                     "address": "서울특별시 강남구 테헤란로 124",
                                                     "latitude": 23.14141,
                                                     "longitude": 23.41433,
                                                     "buildingType": "OFFICE",
                                                     "area": 84.8,
                                                     "areaP": 32,
                                                     "deposit": 10000000,
                                                     "mnRent": 800000,
                                                     "fee": 50000,
                                                     "images": [], //s3 연결이 아직 안됨.
                                                     "period": 24,
                                                     "floor": 5,
                                                     "facing": "N",
                                                     "roomCnt": 2,
                                                     "bathroomCnt": 1,
                                                     "constructionDate": "2020-12-12",
                                                     "parkingCnt": 1,
                                                     "hasElevator": true,
                                                     "petAvailable": true,
                                                     "isAucPref": true,
                                                     "isBrkPref": true,
                                                     "isLinked": false,
                                                     "aucAt": "2025-12-10",
                                                     "aucAvailable": "12월 10일 오후 시간대 희망합니다."
                                                 },
                                                 "message": "해당 매물의 상세 정보를 조회합니다.",
                                                 "status": 200,
                                                 "timestamp": 1761722242143
                                             }
                                            """
                            )
                    )
            )
    })
    @PostMapping(value = "/detail", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResponseDTO<PropertyRegiResponseDto>> createProperty(@RequestBody PropertyDetailRequestDto req,
                                                                               @RequestPart(value = "images", required = false) List<MultipartFile> images,
                                                                               @AuthenticationPrincipal Integer userSeq)
    {
        PropertyRegiResponseDto res = propertyService.submitDetail(userSeq, req, images);
        return ResponseDTO.created(res, "매물 등록 완료");
    }


    /**
     * 매물 상세 정보 조회
     * @param propertySeq
     * @return
     */
    @Operation(
            summary = "매물 상세 조회",
            description = "매물 상세 조회"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "매물 상세 정보 조회 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ResponseDTO.class)
                    )
            )
    })
    @GetMapping("/{propertySeq}")
    public ResponseEntity<ResponseDTO<DetailResponseDto>> getPropertyDetail(@PathVariable Integer propertySeq)
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
    @Operation(
            summary = "지도 위경도 조회",
            description = "지도용 위경도와 매물 정보를 조회합니다."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "지도 정보 조회 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ResponseDTO.class)
                    )
            )
    })
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
    @Operation(
            summary = "매물 정보 수정",
            description = "매물 정보를 수정합니다."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "매물 정보 수정 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ResponseDTO.class)
                    )
            )
    })
    @PatchMapping("/{propertySeq}")
    public ResponseEntity<ResponseDTO<PropertyUpdateResponseDto>> updateProperty(@PathVariable Integer propertySeq,
                                                                                 @RequestBody PropertyUpdateRequestDto req,
                                                                                 @AuthenticationPrincipal Integer userSeq)
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
    @Operation(
            summary = "매물 삭제",
            description = "매물 삭제합니다."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "매물 삭제 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ResponseDTO.class)
                    )
            )
    })
    @DeleteMapping("/{propertySeq}")
    public ResponseEntity<ResponseDTO<Void>> deleteProperty(@PathVariable Integer propertySeq,
                                                            @AuthenticationPrincipal Integer userSeq)
    {
        propertyService.deleteProperty(propertySeq, userSeq);
        return ResponseDTO.ok(null, "매물이 삭제되었습니다.");
    }

}
