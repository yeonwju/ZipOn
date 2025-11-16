package ssafy.a303.backend.auction.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
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
import ssafy.a303.backend.auction.entity.Bid;
import ssafy.a303.backend.auction.kafka.BidEventProducer;
import ssafy.a303.backend.auction.service.BidService;
import ssafy.a303.backend.common.exception.CustomException;
import ssafy.a303.backend.common.response.ErrorCode;
import ssafy.a303.backend.common.response.ResponseDTO;

import java.util.List;

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

    @GetMapping("/{property_id}")
    @Operation(
            summary = "특정 매물에 대한 내 입찰 조회",
            description = """
                    특정 매물(property)에 대해 현재 로그인한 사용자의 입찰 내역을 조회합니다.
                    - 종료된 경매인 경우: DB에 저장된 입찰 정보를 반환합니다.
                    - 진행 중 경매 + 이미 입찰한 상태인 경우: 본문 없이 메시지만 내려줍니다.
                    - 아직 입찰하지 않은 경우: BID_NOT_FOUND 에러를 반환합니다.
                    """
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "종료된 경매에 대한 내 입찰 내역 조회 성공",
                    content = @Content()
            ),
            @ApiResponse(
                    responseCode = "201",
                    description = "현재 진행 중인 경매에 참여하였습니다. 경매 종료까지 기다려주세요.",
                    content = @Content()
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "해당 경매가 존재하지 않습니다.",
                    content = @Content()
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "해당 데이터의 경매 기록이 없습니다.",
                    content = @Content()
            )
    })
    public ResponseEntity<ResponseDTO<Bid>> getMyBidForProperty(
            @AuthenticationPrincipal Integer userSeq,
            @PathVariable("property_id") Integer propertyId
    ) {
        Bid bid = bidService.getMyBidForProperty(userSeq, propertyId);
        if(bid == null)
            return ResponseDTO.created(null, "현재 진행 중인 경매에 참여하였습니다. 경매 종료까지 기다려주세요.");
        return ResponseDTO.ok(bid, "내 입찰 내역 조회");
    }

    @GetMapping("/list")
    @Operation(
            summary = "내가 입찰한 전체 경매 목록 조회",
            description = """
                    현재 로그인한 사용자가 지금까지 입찰한 모든 경매의 입찰 내역을 조회합니다.
                    - 종료된 경매의 입찰만 조회됩니다.
                    - 진행 중 경매의 입찰은 Redis에만 존재하므로 포함되지 않습니다.
                    """
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "내 입찰 목록 조회",
                    content = @Content(
                            array = @ArraySchema(schema = @Schema(implementation = Bid.class))
                    )
            )
    })
    public ResponseEntity<ResponseDTO<List<Bid>>> getMyBidList(
            @AuthenticationPrincipal Integer userSeq
    ) {
        List<Bid> bids = bidService.getMyBids(userSeq);
        return ResponseDTO.ok(bids, "내 입찰 목록 조회");
    }
}
