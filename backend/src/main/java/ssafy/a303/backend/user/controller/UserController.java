package ssafy.a303.backend.user.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import ssafy.a303.backend.common.response.ResponseDTO;
import ssafy.a303.backend.sms.service.SmsService;
import ssafy.a303.backend.user.dto.request.CodeRequest;
import ssafy.a303.backend.user.dto.request.VerifyUserRequest;
import ssafy.a303.backend.user.dto.response.MeResponseDTO;
import ssafy.a303.backend.user.service.UserService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/user")
@Tag(name = "User", description = "사용자 정보 관련 API")
public class UserController {

    private final UserService userService;
    private final SmsService smsService;

    @Operation(
            summary = "내 정보 조회",
            description = "현재 로그인한 사용자의 상세 정보를 조회합니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "404", description = "사용자를 찾을 수 없음")
    })
    @GetMapping("/me")
    public ResponseEntity<ResponseDTO<MeResponseDTO>> getUser(@AuthenticationPrincipal Integer userSeq) {
        MeResponseDTO meResponseDTO = userService.getUser(userSeq);
        return ResponseDTO.ok(meResponseDTO, "사용자를 조회하였습니다.");
    }

    @PostMapping("/verify/sms")
    public ResponseEntity<ResponseDTO<Void>> smsRegist(@AuthenticationPrincipal Integer userSeq, @RequestBody VerifyUserRequest request) {
        smsService.sendAndSave(userSeq, request);
        return ResponseDTO.ok(null, "문자를 발송하였습니다.");
    }

    @PostMapping("/verify/code")
    public ResponseEntity<ResponseDTO<MeResponseDTO>> smsVerify(@AuthenticationPrincipal Integer userSeq, @RequestBody CodeRequest request){
        return ResponseDTO.ok(smsService.verify(userSeq, request.code()), "인증되었습니다.");
    }

}
