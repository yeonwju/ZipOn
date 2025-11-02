package ssafy.a303.backend.broker.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ssafy.a303.backend.broker.dto.response.BrokerInfoResponse;
import ssafy.a303.backend.broker.service.BrokerService;
import ssafy.a303.backend.common.response.ResponseDTO;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/broker")
public class BrokerController {

    private final BrokerService brokerService;

    @GetMapping("/info")
    public ResponseEntity<ResponseDTO<BrokerInfoResponse>> getBrokerInfo() {

        return ResponseDTO.ok(null, "중개인 정보를 불러왔습니다.");
    }

}
