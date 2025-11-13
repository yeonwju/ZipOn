package ssafy.a303.backend.auction.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import ssafy.a303.backend.auction.dto.request.BrkApplyRequestDto;
import ssafy.a303.backend.auction.dto.request.BrkCancelRequestDto;
import ssafy.a303.backend.auction.dto.response.BrkApplicantResponseDto;
import ssafy.a303.backend.auction.dto.response.BrkApplyResponseDto;
import ssafy.a303.backend.auction.dto.response.BrkCancelResponseDto;
import ssafy.a303.backend.auction.service.AuctionService;
import ssafy.a303.backend.auction.service.AuctionService;
import ssafy.a303.backend.common.response.ResponseDTO;
import ssafy.a303.backend.property.dto.response.DetailResponseDto;

@Tag(name = "중개 및 경매")
@RestController
@RequestMapping("/api/v1/auctions")
@RequiredArgsConstructor
public class AuctionController {

    private final AuctionService auctionService;

    /**
     * 중개인이 매물에 대한 중개/경매 신청
     * @param propertySeq
     * @return
     */
    @Operation(
            summary = "중개 및 경매 신청",
            description = "매물의 정보에 따라 중개만 신청하거나 경매를 신청할 수 있습니다. 경매날짜, 시간이 null이면 중개만 신청."
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

    /**
     * 중개인이 매물에 대한 중개 신청을 취소
     * @param auctionSeq
     * @param userSeq
     * @param req
     * @return
     */
    @Operation(
            summary = "중개 및 경매 신청 취소",
            description = "중개인이 신청을 취소합니다."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "중개 신청 취소 성공",
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
    @PutMapping("/applications/{auctionSeq}/cancel")
    public ResponseEntity<ResponseDTO<BrkCancelResponseDto>> cancelMyApply(@PathVariable Integer auctionSeq,
                                                                           @AuthenticationPrincipal Integer userSeq,
                                                                           @RequestBody BrkCancelRequestDto req)
    {
        BrkCancelResponseDto res = auctionService.cancelMyApply(auctionSeq, userSeq, req);
        return ResponseDTO.ok(res, "신청이 취소되었습니다.");
    }

    /**
     * 중개인 신청 목록 조회
     * REQUESTED, ACCEPTED 상태의 신청만 조회
     * @param propertySeq
     * @param userSeq
     * @param pageable
     * @return
     */
    @Operation(
            summary = "신청 중개인 리스트 조회",
            description = "페이징 처리 되어 있습니다. page, size, sort 쿼리 파라미터로"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "신청 중개인 리스트 조회 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = BrkApplicantResponseDto.class),
                            examples = @ExampleObject(
                                    name = "성공 응답 예시",
                                    value = """
                                            {
                                              "data": {
                                                "content": [
                                                  {
                                                    "auctionSeq": 6,
                                                    "brkUserSeq": 2,
                                                    "brkNm": "김도현",
                                                    "brkProfileImg": null,
                                                    "status": "ACCEPTED",
                                                    "mediateCnt": 1,
                                                    "intro": "굿",
                                                    "strmDate": "2025-12-11",
                                                    "strmStartTm": "14:00:00",
                                                    "strmEndTm": "15:00:00"
                                                  },
                                                  {
                                                    "auctionSeq": 5,
                                                    "brkUserSeq": 2,
                                                    "brkNm": "김도현",
                                                    "brkProfileImg": null,
                                                    "status": "REQUESTED",
                                                    "mediateCnt": 1,
                                                    "intro": "겁나 빨리 팝니다",
                                                    "strmDate": "2025-12-12",
                                                    "strmStartTm": "16:00:00",
                                                    "strmEndTm": "17:00:00"
                                                  }
                                                ],
                                                "pageable": {
                                                  "pageNumber": 0,
                                                  "pageSize": 2,
                                                  "sort": {
                                                    "empty": false,
                                                    "sorted": true,
                                                    "unsorted": false
                                                  },
                                                  "offset": 0,
                                                  "paged": true,
                                                  "unpaged": false
                                                },
                                                "last": true,
                                                "totalElements": 2,
                                                "totalPages": 1,
                                                "size": 2,
                                                "number": 0,
                                                "sort": {
                                                  "empty": false,
                                                  "sorted": true,
                                                  "unsorted": false
                                                },
                                                "first": true,
                                                "numberOfElements": 2,
                                                "empty": false
                                              },
                                              "message": "신청된 중개인 목록 조회 성공",
                                              "status": 200,
                                              "timestamp": 1762998510965
                                            }
                                    """
                            )
                    )
            )
    })
    @GetMapping("/{propertySeq}/applicants")
    public ResponseEntity<ResponseDTO<Page<BrkApplicantResponseDto>>> listApplicants(@PathVariable Integer propertySeq,
                                                                                    @AuthenticationPrincipal Integer userSeq,
                                                                                    @PageableDefault(size = 10, sort = "strmDate", direction = Sort.Direction.DESC) Pageable pageable)
    {
        var page = auctionService.listApplicants(propertySeq, userSeq, pageable);
        return ResponseDTO.ok(page, "신청된 중개인 목록 조회 성공");
    }

    @PostMapping("/{auctionSeq}/accept")
    public ResponseEntity<ResponseDTO<Void>> acceptBrk(@AuthenticationPrincipal Integer userSeq,
                                                       @PathVariable Integer auctionSeq) {

    }

}
