package ssafy.a303.backend.broker.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ssafy.a303.backend.broker.dto.request.BrokerInfoRequest;
import ssafy.a303.backend.common.response.ResponseDTO;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/broker")
public class BrokerController {

    @PostMapping
    public ResponseEntity<ResponseDTO<Void>> enroll(@RequestBody BrokerInfoRequest brokerInfoRequest) {

        return ResponseDTO.ok(null, "작업중");
    }
}
