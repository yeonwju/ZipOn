package ssafy.a303.backend.auction.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ssafy.a303.backend.auction.entity.Auction;
import ssafy.a303.backend.auction.service.AuctionService;
import ssafy.a303.backend.common.response.ResponseDTO;

@Tag(name = "중개 및 경매")
@RestController
@RequestMapping("/api/v1/public/auctions")
@RequiredArgsConstructor
public class AuctionPublicController {

    private final AuctionService auctionService;

    @Operation(
            summary = "경매 상세 조회",
            description = "auctionSeq 로 단일 경매 정보를 조회합니다."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "경매를 조회하였습니다.",
                    content = @Content()
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "해당 경매가 존재하지 않습니다.",
                    content = @Content()
            )
    })
    @GetMapping("/{auctionSeq}")
    public ResponseEntity<ResponseDTO<Auction>> getAuction(@PathVariable int auctionSeq) {
        Auction auction = auctionService.getAuction(auctionSeq);
        return ResponseDTO.ok(auction, "경매를 조회하였습니다.");
    }
}
