package ssafy.a303.backend.livestream.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ssafy.a303.backend.livestream.service.LiveService;

@Tag(name = "라이브 방송")
@RestController
@RequestMapping("/api/v1/live")
@RequiredArgsConstructor
@Log4j2
public class LiveController {

    private final LiveService liveService;

    /**
     * 라이브 방송 시작*/
    @PostMapping
    public ResponseEntity<ResponseDTO<LiveResponseDto>> startLive() {}

}
