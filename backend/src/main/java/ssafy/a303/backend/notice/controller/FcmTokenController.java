package ssafy.a303.backend.notice.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ssafy.a303.backend.notice.dto.request.FcmTokenRequest;
import ssafy.a303.backend.notice.service.FcmTokenService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/notifications")
public class FcmTokenController {

    private final FcmTokenService fcmTokenService;

    @PostMapping("/token")
    public ResponseEntity<?> resigterToken(
            @AuthenticationPrincipal int userSeq,
            @RequestBody FcmTokenRequest request
            ) {
        fcmTokenService.registerToken(userSeq, request);
        return ResponseEntity.ok("토큰 등록 완료");
    }
}
