package ssafy.a303.backend.auction.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import ssafy.a303.backend.auction.dto.request.BrkApplyRequestDto;
import ssafy.a303.backend.auction.dto.response.BrkApplyResponseDto;
import ssafy.a303.backend.auction.service.AuctionService;
import ssafy.a303.backend.common.response.ResponseDTO;
import ssafy.a303.backend.property.dto.response.DetailResponseDto;

@Tag(name = "경매")
@RestController
@RequestMapping("/api/v1/auctions")
@RequiredArgsConstructor
public class AuctionController {

    private final AuctionService auctionService;

    /**
     * 매물 상세 정보 조회
     * @param propertySeq
     * @return
     */
    @Operation(
            summary = "중개 및 경매 신청",
            description = "매물의 정보에 따라 중개만 신청하거나 경매를 신청할 수 있습니다."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "매물 중개 및 경매 신청 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = BrkApplyResponseDto.class),
                            examples = @ExampleObject(
                                    name = "성공 응답 예시",
                                    value = """
                                            {
                                                "data": {
                                                    "auctionSeq": 3,
                                                    "propertySeq": 9,
                                                    "userSeq": 2,
                                                    "status": "REQUESTED",
                                                    "strmDate": null,
                                                    "strmStartTm": null,
                                                    "strmEndTm": null,
                                                    "auctionEndAt": null,
                                                    "intro": "빠르게 팔아드릴게요~"
                                                },
                                                "message": "해당 매물에 중개 신청 되었습니다.",
                                                "status": 200,
                                                "timestamp": 1762918106493
                                            }        
                                    """
                            )
                    )
            )
    })
    @PostMapping("/applications/{propertySeq}")
    public ResponseEntity<ResponseDTO<BrkApplyResponseDto>> apply(@PathVariable Integer propertySeq,
                                                                  @AuthenticationPrincipal Integer userSeq,
                                                                  @RequestBody(required = false) BrkApplyRequestDto req)
    {
        BrkApplyResponseDto res = auctionService.apply(propertySeq, userSeq, req);
        String message;
        if(req.strmDate() == null) {
            message = "해당 매물에 중개 신청 되었습니다.";
        } else {
            message = "해당 매물에 경매 신청 되었습니다.";
        }
        return ResponseDTO.ok(res, message);
    }
}
