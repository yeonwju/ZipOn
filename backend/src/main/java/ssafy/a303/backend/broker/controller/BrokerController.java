package ssafy.a303.backend.broker.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ssafy.a303.backend.broker.dto.request.BrokerInfoRequest;
import ssafy.a303.backend.broker.service.BrokerService;
import ssafy.a303.backend.common.response.ResponseDTO;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/broker")
public class BrokerController {

    private final BrokerService brokerService;

    @PostMapping
    public ResponseEntity<ResponseDTO<Void>> enroll(@AuthenticationPrincipal int userSeq, @RequestBody BrokerInfoRequest brokerInfoRequest) {
        brokerService.regist(userSeq, brokerInfoRequest.taxSeq());
        return ResponseDTO.ok(null, "작업중");
    }
}
