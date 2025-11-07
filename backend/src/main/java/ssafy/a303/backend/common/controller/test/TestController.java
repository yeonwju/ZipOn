package ssafy.a303.backend.common.controller.test;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ssafy.a303.backend.common.response.ResponseDTO;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Slf4j
public class TestController {
    @GetMapping("/test")
    public ResponseEntity<ResponseDTO<Void>> test(@AuthenticationPrincipal int userSeq) {
        return ResponseDTO.ok(null, "test connect: user_seq :" + userSeq + "번");
    }
}
