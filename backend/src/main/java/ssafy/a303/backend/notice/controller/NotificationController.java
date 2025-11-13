package ssafy.a303.backend.notice.controller;

import com.google.firebase.messaging.FirebaseMessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ssafy.a303.backend.notice.dto.FcmSendRequest;
import ssafy.a303.backend.notice.dto.FcmTokenRequest;
import ssafy.a303.backend.notice.service.FcmService;

@RestController
@RequestMapping("/api/vi/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final FcmService fcmService;

    @PostMapping("/token")
    public ResponseEntity<String> registerToken(@RequestBody FcmTokenRequest request) {
        System.out.println("🔹 받은 FCM 토큰: " + request.getToken());
        return ResponseEntity.ok("토큰 등록 완료");
    }

    @PostMapping("/send")
    public ResponseEntity<String> sendTest(@RequestBody FcmSendRequest request)
        throws FirebaseMessagingException {
        fcmService.sentMessageTo(request.getToken(), request.getTitle(), request.getBody());
        return ResponseEntity.ok("푸시 발송 완료");
    }
}
