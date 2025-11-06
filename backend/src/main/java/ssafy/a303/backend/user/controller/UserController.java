package ssafy.a303.backend.user.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import ssafy.a303.backend.common.response.ResponseDTO;
import ssafy.a303.backend.sms.service.SmsService;
import ssafy.a303.backend.user.dto.response.MeResponseDTO;
import ssafy.a303.backend.user.service.UserService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/user")
public class UserController {

    private final UserService userService;
    private final SmsService service;

    @GetMapping("/me")
    public ResponseEntity<ResponseDTO<MeResponseDTO>> getUser(@AuthenticationPrincipal Integer userSeq) {
        MeResponseDTO meResponseDTO = userService.getUser(userSeq);
        return ResponseDTO.ok(meResponseDTO, "사용자를 조회하였습니다.");
    }

    @PostMapping
    public ResponseEntity<ResponseDTO<Void>> smsRegist(@AuthenticationPrincipal Integer userSeq, @RequestPart String tel) {
        service.send(userSeq, tel);
        return ResponseDTO.ok(null, "문자를 발송하였습니다.");
    }

}
