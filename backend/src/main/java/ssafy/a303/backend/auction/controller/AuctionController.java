//package ssafy.a303.backend.auction.controller;
//
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.core.annotation.AuthenticationPrincipal;
//import org.springframework.web.bind.annotation.*;
//import ssafy.a303.backend.auction.dto.request.BrkApplyRequestDto;
//import ssafy.a303.backend.auction.dto.response.BrkApplyResponseDto;
//import ssafy.a303.backend.auction.service.AuctionService;
//import ssafy.a303.backend.common.response.ResponseDTO;
//
//@RestController
//@RequestMapping("/api/v1/auctions")
//@RequiredArgsConstructor
//public class AuctionController {
//
//    private final AuctionService auctionService;
//
//    @PostMapping("/applications/{propertySeq}")
//    public ResponseEntity<ResponseDTO<BrkApplyResponseDto>> apply(@PathVariable Integer propertySeq,
//                                                                  @AuthenticationPrincipal Integer userSeq,
//                                                                  @RequestBody(required = false)BrkApplyRequestDto req)
//    {
//        BrkApplyResponseDto res = auctionService.apply(propertySeq, userSeq, req);
//        return ResponseDTO.ok(res, "해당 매물에 중개/경매 신청이 되었습니다.");
//    }
//
//}
