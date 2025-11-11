package ssafy.a303.backend.security.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import ssafy.a303.backend.common.response.ResponseDTO;

@RequestMapping("/api/v1/login")
public class LoginController {
    @GetMapping("/google")
    public ResponseEntity<ResponseDTO<Void>> google(){
        return ResponseDTO.ok(null,"Hello");
    }
}
