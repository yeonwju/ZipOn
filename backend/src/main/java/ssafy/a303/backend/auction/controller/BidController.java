package ssafy.a303.backend.auction.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ssafy.a303.backend.auction.dto.request.BidEventMessage;
import ssafy.a303.backend.auction.kafka.BidEventProducer;
import ssafy.a303.backend.common.response.ResponseDTO;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/public/attendance")
public class BidController {

    private final BidEventProducer producer;

    @PostMapping
    public ResponseEntity<ResponseDTO<Void>> sendBid(@RequestParam Integer auctionSeq,
                                                     @RequestParam Integer userSeq,
                                                     @RequestParam long amount
    ) {
        BidEventMessage msg = BidEventMessage.of(
                auctionSeq,
                userSeq,
                amount
        );

        producer.sendBid(msg);
        return ResponseDTO.ok(null, "전송됨");
    }
}
