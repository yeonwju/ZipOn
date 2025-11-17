package ssafy.a303.backend.auction.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import ssafy.a303.backend.auction.service.AuctionWinnerService;
import ssafy.a303.backend.common.response.ResponseDTO;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auctions")
public class AuctionWinnerController {

    private final AuctionWinnerService winnerService;

    /**
     * 경매 종료 시 낙찰 후보 1~5 선정
     * 1등에게 알림
     */
    @PostMapping("/{auctionSeq}/winner/prepare")
    public ResponseEntity<ResponseDTO<Void>> prepareWinners(
            @PathVariable int auctionSeq
    ) {
        winnerService.prepareWinnersAndOfferFirst(auctionSeq);
        return ResponseDTO.ok(null, "낙찰 후보 선정 및 1순위 제안 완료");
    }

    /**
     * 낙찰 수락
     */
    @PostMapping("/{auctionSeq}/winner/accept")
    public ResponseEntity<ResponseDTO<Void>> acceptWinner(
            @AuthenticationPrincipal int userSeq,
            @PathVariable int auctionSeq
    ) {
        winnerService.acceptWinner(userSeq, auctionSeq);
        return ResponseDTO.ok(null, "낙찰 수락 완료");
    }

    /**
     * 낙찰 거절 → 다음 순위에게 자동 알림
     */
    @PostMapping("/{auctionSeq}/winner/reject")
    public ResponseEntity<ResponseDTO<Void>> rejectWinner(
            @AuthenticationPrincipal int userSeq,
            @PathVariable int auctionSeq
    ) {
        winnerService.rejectWinner(userSeq, auctionSeq);
        return ResponseDTO.ok(null, "낙찰 거절 처리 및 다음 순위 알림");
    }
}
