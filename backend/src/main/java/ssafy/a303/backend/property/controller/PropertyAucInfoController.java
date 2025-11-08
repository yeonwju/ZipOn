package ssafy.a303.backend.property.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
//import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import ssafy.a303.backend.common.response.ResponseDTO;
import ssafy.a303.backend.property.dto.request.PropertyAucInfoUpdateRequestDto;
import ssafy.a303.backend.property.dto.response.PropertyAucInfoUpdateResponseDto;
import ssafy.a303.backend.property.service.PropertyAucInfoService;

@Tag(name="매물 경매 정보")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/properties/auc")
public class PropertyAucInfoController {

    private final PropertyAucInfoService aucInfoService;

    @Operation(
            summary = "매물 경매 및 중개 여부 정보 수정",
            description = "매물 정보 중 경매 및 중개 여부와 관련된 정보 수정 api입니다."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "매물 경매 및 중개 여부 수정 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ResponseDTO.class)
                    )
            )
    })
    @PatchMapping("/{propertySeq}")
    public ResponseEntity<ResponseDTO<PropertyAucInfoUpdateResponseDto>> updateAucInfo(@PathVariable Integer propertySeq,
                                                                                       @RequestBody PropertyAucInfoUpdateRequestDto req,
                                                                                       @AuthenticationPrincipal Integer userSeq)
    {
        PropertyAucInfoUpdateResponseDto response = aucInfoService.updateAucInfo(propertySeq, req, userSeq);
        return ResponseDTO.ok(response, "매물 경매 및 중개 정보가 수정되었습니다.");
    }
}
