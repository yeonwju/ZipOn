package ssafy.a303.backend.auction.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Slice;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import ssafy.a303.backend.auction.dto.projection.AuctionAlarmProjection;
import ssafy.a303.backend.auction.service.AuctionAlarmService;
import ssafy.a303.backend.common.response.ResponseDTO;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auction/alarm")
public class AuctionAlarmController {
    private final AuctionAlarmService auctionAlarmService;

    @PostMapping("/{auctionSeq}")
    public ResponseEntity<ResponseDTO<Void>>save(@AuthenticationPrincipal int userSeq, @PathVariable int auctionSeq){
        auctionAlarmService.save(userSeq,auctionSeq);
        return ResponseDTO.created(null, "방송 알람 저장됨");
    }
    @DeleteMapping("/{auctionSeq}")
    public ResponseEntity<ResponseDTO<Void>>delete(@AuthenticationPrincipal int userSeq, @PathVariable int auctionSeq){
        auctionAlarmService.delete(userSeq, auctionSeq);
        return ResponseDTO.ok(null, "방송 알람 삭제됨");
    }
    @GetMapping("/{cursor}")
    public ResponseEntity<ResponseDTO<Slice<AuctionAlarmProjection>>>getList(@AuthenticationPrincipal int userSeq, @PathVariable long cursor){
        Slice<AuctionAlarmProjection> list = auctionAlarmService.getMyAlarmsScroll(userSeq, cursor, 10);
        return ResponseDTO.ok(list, "방송 알람 조회됨");
    }
}
