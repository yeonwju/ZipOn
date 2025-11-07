package ssafy.a303.backend.broker.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
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
public class BrokerController {

    private final BrokerService brokerService;

    @PostMapping
    public ResponseEntity<ResponseDTO<Void>> enroll(
            @AuthenticationPrincipal int userSeq,
            @RequestPart("taxSeq") String taxSeq
            ) {
        brokerService.regist(userSeq, taxSeq);
        return ResponseDTO.ok(null, "중개사 등록 요청이 접수되었습니다.");
    }
}
