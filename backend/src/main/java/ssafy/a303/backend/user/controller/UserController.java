package ssafy.a303.backend.user.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
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
            @ApiResponse(responseCode = "200", description = "조회 성공", content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "404", description = "사용자를 찾을 수 없습니다.", content = @Content())
    })
    @GetMapping("/me")
    public ResponseEntity<ResponseDTO<MeResponseDTO>> getUser(@AuthenticationPrincipal Integer userSeq) {
        MeResponseDTO meResponseDTO = userService.getUser(userSeq);
        return ResponseDTO.ok(meResponseDTO, "사용자를 조회하였습니다.");
    }
    @Operation(
            summary = "휴대폰 인증 문자 발송",
            description = "사용자의 이름, 생년월일, 전화번호 정보를 받아 인증 문자를 발송합니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "문자 발송 성공", content = @Content()),
            @ApiResponse(responseCode = "400", description = "요청 데이터 형식 또는 값이 올바르지 않음", content = @Content()),
            @ApiResponse(responseCode = "401", description = "인증 실패: 토큰이 없거나 유효하지 않음", content = @Content()),
            @ApiResponse(responseCode = "429", description = "요청 제한 초과: 내일 다시 시도 (EXTERNAL_API_LIMIT)", content = @Content()),
            @ApiResponse(responseCode = "502", description = "외부 문자 서비스 연동 오류 (EXTERNAL_API_ERROR)", content = @Content())
    })
    @PostMapping("/verify/sms")
    public ResponseEntity<ResponseDTO<Void>> smsRegist(@AuthenticationPrincipal Integer userSeq, @RequestBody VerifyUserRequest request) {
        smsService.sendAndSave(userSeq, request);
        return ResponseDTO.ok(null, "문자를 발송하였습니다.");
    }
    @Operation(
            summary = "휴대폰 인증번호 검증",
            description = "발송된 인증번호를 검증하고, 성공 시 사용자 정보를 갱신하여 반환합니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "인증 성공 및 사용자 정보 반환", content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "400", description = "잘못된 인증번호", content = @Content()),
            @ApiResponse(responseCode = "401", description = "인증 실패: 토큰이 없거나 유효하지 않음", content = @Content()),
            @ApiResponse(responseCode = "404", description = "인증 대상 정보 없음: 코드 미발송(SMS_NOT_SENDED) 또는 사용자 없음(USER_NOT_FOUND)", content = @Content())
    })
    @PostMapping("/verify/code")
    public ResponseEntity<ResponseDTO<MeResponseDTO>> smsVerify(@AuthenticationPrincipal Integer userSeq, @RequestBody CodeRequest request){
        return ResponseDTO.ok(smsService.verify(userSeq, request.code()), "인증되었습니다.");
    }

}
