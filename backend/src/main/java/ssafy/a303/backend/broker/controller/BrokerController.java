package ssafy.a303.backend.broker.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import ssafy.a303.backend.broker.service.BrokerService;
import ssafy.a303.backend.common.response.ResponseDTO;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/broker")
@Tag(name = "Broker", description = "중개사 등록 관련 API")
public class BrokerController {

    private final BrokerService brokerService;

    @Operation(
            summary = "중개사 등록 요청",
            description = "로그인한 사용자가 사업자등록번호를 통해 중개사 등록을 신청합니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "중개사 등록 성공"),
            @ApiResponse(responseCode = "400", description = "요청 데이터 형식 또는 값이 올바르지 않음"),
            @ApiResponse(responseCode = "401", description = "인증 실패: 토큰이 없거나 유효하지 않음"),
            @ApiResponse(responseCode = "404", description = "유효하지 않은 사업자등록번호"),
            @ApiResponse(responseCode = "403", description = "본인 인증이 완료되지 않은 사용자")
    })
    @PostMapping
    public ResponseEntity<ResponseDTO<Void>> enroll(
            @AuthenticationPrincipal int userSeq,
            @RequestPart("taxSeq") String taxSeq
    ) {
        brokerService.regist(userSeq, taxSeq);
        return ResponseDTO.ok(null, "중개사 등록 성공");
    }
}
