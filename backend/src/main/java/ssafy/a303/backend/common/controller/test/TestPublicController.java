package ssafy.a303.backend.common.controller.test;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ssafy.a303.backend.common.response.ResponseDTO;

@RestController
@RequestMapping("/api/v1/public")
public class TestPublicController {

    @GetMapping("/test")
    public ResponseEntity<ResponseDTO<Void>> test() {
        return ResponseDTO.ok(null, "test connect");
    }
}
