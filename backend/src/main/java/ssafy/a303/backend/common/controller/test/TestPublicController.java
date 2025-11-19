package ssafy.a303.backend.common.controller.test;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import ssafy.a303.backend.auction.dto.request.BidEventMessage;
import ssafy.a303.backend.auction.dto.request.BidRequestDTO;
import ssafy.a303.backend.auction.kafka.BidEventProducer;
import ssafy.a303.backend.auction.repository.AuctionInProgressRepository;
import ssafy.a303.backend.auction.repository.BidRankRepository;
import ssafy.a303.backend.auction.repository.BidTryCountRepository;
import ssafy.a303.backend.auction.service.BidRankService;
import ssafy.a303.backend.common.exception.CustomException;
import ssafy.a303.backend.common.response.ErrorCode;
import ssafy.a303.backend.common.response.ResponseDTO;
import ssafy.a303.backend.user.entity.Role;
import ssafy.a303.backend.user.entity.User;
import ssafy.a303.backend.user.repository.UserRepository;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/v1/public/test")
@RequiredArgsConstructor
public class TestPublicController {

    private final BidEventProducer producer;
    private final UserRepository userRepository;
    private final BidRankService bidRankService;
    private final BidRankRepository bidRankRepository;
    private final BidTryCountRepository bidTryCountRepository;
    private final AuctionInProgressRepository auctionInProgressRepository;

    @GetMapping
    public ResponseEntity<ResponseDTO<Void>> test() {
        return ResponseDTO.ok(null, "test connect");
    }

//    @PostMapping("/addUser")
//    public ResponseEntity<ResponseDTO<Void>> testUser(){
//        List<User> list = new ArrayList<>();
//        for(int i = 0 ; i < 1000; i++){
//            User user = User.builder()
//                    .email(String.format("load-test-%s@gmail.com",i))
//                    .nickname(String.format("load-user-%s",i))
//                    .name(String.format("부하테스트 유저-%s",i))
//                    .role(Role.USER)
//                    .build();
//            list.add(user);
//        }
//        userRepository.saveAll(list);
//        return ResponseDTO.created(null,"생성되었습니다");
//    }
//
//    @PostMapping("/bid")
//    public ResponseEntity<ResponseDTO<Void>> sendBidKafka(
//            @RequestParam Integer userSeq,
//            @RequestBody BidRequestDTO bidRequestDTO
//    ) {
//        if (bidRequestDTO.amount() > Integer.MAX_VALUE) throw new CustomException(ErrorCode.AMOUNT_MAX_VALUE);
//
//        BidEventMessage msg = BidEventMessage.of(
//                bidRequestDTO.auctionSeq(),
//                userSeq,
//                bidRequestDTO.amount()
//        );
//
//        producer.sendBid(msg);
//        return ResponseDTO.ok(null, "전송됨");
//    }
//
//    @PostMapping("/bid/no")
//    public ResponseEntity<ResponseDTO<Void>> sendBidNoKafka(
//            @RequestParam Integer userSeq,
//            @RequestBody BidRequestDTO bidRequestDTO
//    ) {
//        if (bidRequestDTO.amount() > Integer.MAX_VALUE) throw new CustomException(ErrorCode.AMOUNT_MAX_VALUE);
//
//        BidEventMessage msg = BidEventMessage.of(
//                bidRequestDTO.auctionSeq(),
//                userSeq,
//                bidRequestDTO.amount()
//        );
//        bidRankService.check(msg);
//        bidRankService.updateRanking(msg);
//        return ResponseDTO.ok(null, "전송됨");
//    }

    @GetMapping("/bid/reset/{auctionSeq}")
    public ResponseEntity<ResponseDTO<Void>> bidReset(@PathVariable int auctionSeq){
        bidRankRepository.deleteKey(auctionSeq);
        bidTryCountRepository.deleteKey(auctionSeq);
        auctionInProgressRepository.deleteKey(auctionSeq);
        return ResponseDTO.ok(null, "초기화");
    }
}
