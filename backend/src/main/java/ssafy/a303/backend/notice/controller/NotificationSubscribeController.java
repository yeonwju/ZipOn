package ssafy.a303.backend.notice.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import ssafy.a303.backend.notice.service.NotificationSubscribeService;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/notifications/auction")
public class NotificationSubscribeController {

    private final NotificationSubscribeService subscribeService;

    /**
     * 알림 켬 (subscribe)
     * 예: POST /api/v1/notifications/auction/123
     */
    @PostMapping("/{auctionSeq}")
    public ResponseEntity<?> subscribe(
            @AuthenticationPrincipal int userSeq,
            @PathVariable int auctionSeq
    ) {
        subscribeService.subscribe(userSeq, auctionSeq);
        return ResponseEntity.ok("알림받기 설정 완료");
    }

    /**
     * 알림 끔 (unsubscribe)
     * 예: DELETE /api/v1/notifications/auction/123
     */
    @DeleteMapping("/{auctionSeq}")
    public ResponseEntity<?> unsubscribe(
            @AuthenticationPrincipal int userSeq,
            @PathVariable int auctionSeq
    ) {
        subscribeService.unsubscribe(userSeq, auctionSeq);
        return ResponseEntity.ok("알림받기 해제 완료");
    }

    /**
     * 알림 상태 조회
     * 예: GET /api/v1/notifications/auction/4/status
     */
    @GetMapping("/{auctionSeq}/status")
    public ResponseEntity<?> getStatus(
            @AuthenticationPrincipal int userSeq,
            @PathVariable int auctionSeq
    ) {
        boolean subscribed = subscribeService.isSubscribed(userSeq, auctionSeq);
        return ResponseEntity.ok(
                Map.of("알림 상태", subscribed)
        );
    }

}
