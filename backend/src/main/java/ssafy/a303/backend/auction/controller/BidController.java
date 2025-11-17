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
import ssafy.a303.backend.auction.dto.request.BidEventMessage;
import ssafy.a303.backend.auction.dto.request.BidRequestDTO;
import ssafy.a303.backend.auction.dto.response.WinnerAcceptDTO;
import ssafy.a303.backend.auction.kafka.BidEventProducer;
import ssafy.a303.backend.auction.service.BidService;
import ssafy.a303.backend.common.exception.CustomException;
import ssafy.a303.backend.common.response.ErrorCode;
import ssafy.a303.backend.common.response.ResponseDTO;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auction/bid")
@Tag(name = "입찰(Bid)", description = "경매 입찰 관련 API")
public class BidController {

    private final BidEventProducer producer;
    private final BidService bidService;

    @PostMapping
    @Operation(
            summary = "경매 입찰 전송",
            description = """
                    현재 진행 중인 경매에 사용자의 입찰 정보를 전송합니다.
                    - 한 경매에 한 번만 입찰할 수 있습니다.
                    - 21억(2,147,483,647) 이상은 입찰할 수 없습니다.
                    """
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "입찰 전송 성공",
                    content = @Content()
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "잘못된 요청 (예: 21억 이상 입찰)",
                    content = @Content()
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "인증 실패 (로그인 필요)",
                    content = @Content()
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "해당 경매가 존재하지 않거나 진행 중이 아님",
                    content = @Content()
            ),
            @ApiResponse(
                    responseCode = "409",
                    description = "이미 입찰한 사용자",
                    content = @Content()
            )
    })
    public ResponseEntity<ResponseDTO<Void>> sendBid(
            @AuthenticationPrincipal Integer userSeq,
            @RequestBody BidRequestDTO bidRequestDTO
    ) {
        if (bidRequestDTO.amount() > Integer.MAX_VALUE) throw new CustomException(ErrorCode.AMOUNT_MAX_VALUE);

        BidEventMessage msg = BidEventMessage.of(
                bidRequestDTO.auctionSeq(),
                userSeq,
                bidRequestDTO.amount()
        );

        producer.sendBid(msg);
        return ResponseDTO.ok(null, "전송됨");
    }

    /* 낙찰 수락 거절 */
    @Operation(
            summary = "낙찰 수락",
            description = "사용자가 본인에게 제안된 낙찰을 수락합니다."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "낙찰 수락 처리되었습니다.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = WinnerAcceptDTO.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "해당 입찰 정보를 찾을 수 없습니다. (BID_NOT_FOUND)",
                    content = @Content()
            ),
    })
    @PostMapping("/{auctionSeq}/accept")
    public ResponseEntity<ResponseDTO<WinnerAcceptDTO>> accept(
            @AuthenticationPrincipal Integer userSeq,
            @PathVariable int auctionSeq
    ){
        int contractSeq = bidService.acceptOffer(userSeq, auctionSeq);

        WinnerAcceptDTO dto = new WinnerAcceptDTO(contractSeq);

        return ResponseDTO.ok(dto, "처리되었습니다.");
    }

    @Operation(
            summary = "낙찰 거절",
            description = "사용자가 본인에게 제안된 낙찰을 거절합니다."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "낙찰 거절 처리되었습니다.",
                    content = @Content()
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "해당 입찰 정보를 찾을 수 없습니다. (BID_NOT_FOUND)",
                    content = @Content()
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "인증되지 않은 사용자입니다.",
                    content = @Content()
            )
    })
    @PostMapping("/{auctionSeq}/reject")
    public ResponseEntity<ResponseDTO<Void>> reject(
            @AuthenticationPrincipal Integer userSeq,
            @PathVariable int auctionSeq
    ){
        bidService.rejectOffer(userSeq, auctionSeq);
        return ResponseDTO.ok(null, "처리되었습니다.");
    }
}
