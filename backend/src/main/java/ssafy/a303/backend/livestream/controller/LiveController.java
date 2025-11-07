package ssafy.a303.backend.livestream.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ssafy.a303.backend.common.response.ResponseDTO;
import ssafy.a303.backend.livestream.dto.request.LiveCreateRequestDto;
import ssafy.a303.backend.livestream.dto.response.LiveCreateResponseDto;
import ssafy.a303.backend.livestream.service.LiveService;

@Tag(name = "라이브 방송")
@RestController
@RequestMapping("/api/v1/live")
@RequiredArgsConstructor
@Log4j2
public class LiveController {

    private final LiveService liveService;

    /**
     * 라이브 방송 시작
     */
    @Operation(
            summary = "라이브 방송 시작",
            description = "경매에 대한 라이브 방송을 시작합니다.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "방송 시작 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ResponseDTO.class),
                            examples = @ExampleObject(
                                    name = "방송 시작 성공",
                                    value = """
                                {
                                  "status": 200,
                                  "message": "라이브 방송이 시작되었습니다.",
                                  "data": {
                                    "liveSeq": 1,
                                    "sessionId": "ses_abc123",
                                    "title": "강남역 오피스텔 라이브 경매",
                                    "status": "LIVE",
                                    "host": {
                                      "userSeq": 1,
                                      "name": "홍길동",
                                      "profileImg": "https://s3.amazonaws.com/bucket/profile.jpg"
                                    },
                                    "startAt": "2025-11-07T10:30:00"
                                  }
                                }
                                """
                            )
                    )
            )
    })
    @PostMapping
    public ResponseEntity<ResponseDTO<LiveCreateResponseDto>> startLive(
            @RequestBody @Valid LiveCreateRequestDto requestDto,
            @Parameter(hidden = true) @AuthenticationPrincipal Integer hostUserSeq
    ) {
        LiveCreateResponseDto response = liveService.startLive(requestDto, hostUserSeq);
        return ResponseDTO.ok(response, "라이브 방송이 시작되었습니다.");
    }


}
