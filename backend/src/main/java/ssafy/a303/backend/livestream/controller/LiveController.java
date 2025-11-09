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
import org.springframework.web.bind.annotation.*;
import ssafy.a303.backend.common.response.ResponseDTO;
import ssafy.a303.backend.livestream.dto.request.LiveCreateRequestDto;
import ssafy.a303.backend.livestream.dto.response.*;
import ssafy.a303.backend.livestream.enums.LiveStreamStatus;
import ssafy.a303.backend.livestream.service.LiveChatService;
import ssafy.a303.backend.livestream.service.LiveService;

import java.util.List;

@Tag(name = "라이브 방송")
@RestController
@RequestMapping("/api/v1/live")
@RequiredArgsConstructor
@Log4j2
public class LiveController {

    private final LiveService liveService;
    private final LiveChatService liveChatService;

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
                                    "auctionSeq": 1,
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


    /**
     * 방송 입장 토큰 발급
     */
    @Operation(
            summary = "라이브 방송 입장 토큰 발급",
            description = "시청자 또는 방장이 라이브 방송에 입장하기 위해 필요한 OpenVidu 토큰을 발급합니다.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "토큰 발급 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ResponseDTO.class),
                            examples = @ExampleObject(
                                    name = "방송 입장 토큰 발급 성공",
                                    value = """
                                {
                                  "status": 200,
                                  "message": "방송 입장 토큰이 발급되었습니다.",
                                  "data": {
                                    "token": "wss://openvidu.server/ses_abc123?token=xyz...",
                                    "sessionId": "ses_abc123",
                                    "role": "SUBSCRIBER"
                                  }
                                }
                                """
                            )
                    )
            )
    })
    @PostMapping("/{liveSeq}/token")
    public ResponseEntity<ResponseDTO<LiveTokenResponseDto>> startLiveToken(
            @PathVariable Integer liveSeq,
            @RequestParam(defaultValue = "false") boolean isHost,
            @AuthenticationPrincipal Integer userSeq) {

        LiveTokenResponseDto response = liveService.startLiveToken(liveSeq, isHost, userSeq);
                return ResponseDTO.ok(response, "방송 입장 토큰이 발급되었습니다.");
    }

    /**
     * 라이브 방송 종료
     */
    @Operation(
            summary = "라이브 방송 종료",
            description = "방장이 진행 중인 라이브 방송을 종료합니다.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "방송 종료 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ResponseDTO.class),
                            examples = @ExampleObject(
                                    name = "방송 종료 성공",
                                    value = """
                                {
                                  "status": 200,
                                  "message": "라이브 방송이 종료되었습니다.",
                                  "data": {
                                    "liveSeq": 1,
                                    "auctionSeq": 10,
                                    "sessionId": "ses_abc123",
                                    "title": "강남역 오피스텔 라이브 경매",
                                    "status": "ENDED",
                                    "viewerCount": 124,
                                    "chatCount": 58,
                                    "likeCount": 31,
                                    "host": {
                                      "userSeq": 1,
                                      "name": "홍길동",
                                      "profileImg": "https://s3.amazonaws.com/bucket/profile.jpg"
                                    },
                                    "startAt": "2025-11-07T10:30:00",
                                    "endAt": "2025-11-07T11:12:45"
                                  }
                                }
                                """
                            )))})
    @PostMapping("/{liveSeq}/end")
    public ResponseEntity<ResponseDTO<LiveEndResponseDto>> endLive(
            @PathVariable Integer liveSeq,
            @AuthenticationPrincipal Integer userSeq) {

        LiveEndResponseDto reponse = liveService.endLive(liveSeq, userSeq);
        return ResponseDTO.ok(reponse, "라이브 방송이 종료되었습니다.");


    }

    /**
     * 라이브 방송 정보 조회
     */
    @Operation(
            summary = "특정 라이브 방송 정보 조회",
            description = "현재 진행 중이거나 종료된 라이브 방송 정보를 조회합니다.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "라이브 방송 정보 조회 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ResponseDTO.class),
                            examples = @ExampleObject(
                                    name = "라이브 방송 정보 조회 성공",
                                    value = """
                                {
                                  "status": 200,
                                  "message": "라이브 방송 정보를 조회했습니다.",
                                  "data": {
                                    "liveSeq": 1,
                                    "auctionSeq": 10,
                                    "sessionId": "ses_abc123",
                                    "title": "강남역 오피스텔 라이브 경매",
                                    "status": "LIVE",
                                    "viewerCount": 73,
                                    "chatCount": 15,
                                    "likeCount": 9,
                                    "host": {
                                      "userSeq": 1,
                                      "name": "홍길동",
                                      "profileImg": "https://s3.amazonaws.com/bucket/profile.jpg"
                                    },
                                    "startAt": "2025-11-07T10:30:00",
                                    "endAt": null,
                                    "liked" : true
                                  }
                                }
                                """
                            )
                    )
            )
    })
    @GetMapping("/{liveSeq}")
    public ResponseEntity<ResponseDTO<LiveInfoResponseDto>> getLiveInfo(
            @PathVariable Integer liveSeq,
            @AuthenticationPrincipal Integer userSeq) {

        LiveInfoResponseDto reponse = liveService.getLiveInfo(liveSeq, userSeq);
        return ResponseDTO.ok(reponse, "라이브 방송 정보를 조회했습니다.");

    }

    /**
     * 상태별 라이브 방송 목록 조회
     */
    @Operation(
            summary = "상태 별 라이브 방송 목록 조회",
            description = """
                LIVE / ENDED 상태에 따라 라이브 방송 목록을 조회합니다.
                
                - LIVE : 현재 진행 중인 라이브 방송 목록
                - ENDED : 종료된 라이브 다시보기 목록
                """,
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "라이브 방송 목록 조회 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ResponseDTO.class),
                            examples = @ExampleObject(
                                    name = "라이브 방송 목록 조회 성공",
                                    value = """
                                {
                                  "status": 200,
                                  "message": "라이브 방송 목록을 조회했습니다.",
                                  "data": [
                                    {
                                      "liveSeq": 1,
                                      "auctionSeq": 10,
                                      "sessionId": "ses_abc123",
                                      "title": "강남 신축 오피스텔 경매",
                                      "status": "LIVE",
                                      "viewerCount": 73,
                                      "chatCount": 15,
                                      "likeCount": 9,
                                      "host": {
                                        "userSeq": 1,
                                        "name": "홍길동",
                                        "profileImg": "https://s3.amazonaws.com/bucket/profile.jpg"
                                      },
                                      "startAt": "2025-11-07T10:30:00",
                                      "endAt": null,
                                      "liked" : true
                                    }
                                  ]
                                }
                                """
                            )
                    )
            )
    })
    @GetMapping
    public ResponseEntity<ResponseDTO<List<LiveInfoResponseDto>>> getLiveListByStatus(
            @RequestParam(defaultValue = "LIVE") LiveStreamStatus status,
            @AuthenticationPrincipal Integer userSeq
    ){
        List<LiveInfoResponseDto> reponse = liveService.getLiveListByStatus(status, userSeq);
        return ResponseDTO.ok(reponse, "라이브 방송 목록을 조회했습니다.");
    }

    /**
     * 라이브 좋아요/취소 토글
     */
    @Operation(
            summary = "라이브 좋아요 또는 좋아요 취소",
            description = """
                사용자가 라이브 방송에 좋아요를 누르거나 취소합니다.
                
                - 이미 좋아요를 눌렀다면 → 좋아요 취소
                - 아직 좋아요를 누르지 않았다면 → 좋아요 등록
                """,
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "좋아요 상태 변경 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ResponseDTO.class),
                            examples = {
                                    @ExampleObject(
                                            name = "좋아요 눌렀을 때",
                                            value = """
                                        {
                                          "status": 200,
                                          "message": "좋아요를 눌렀습니다.",
                                          "data": true
                                        }
                                        """
                                    ),
                                    @ExampleObject(
                                            name = "좋아요 취소했을 때",
                                            value = """
                                        {
                                          "status": 200,
                                          "message": "좋아요를 취소했습니다.",
                                          "data": false
                                        }
                                        """
                                    )
                            }
                    )
            )
    })
    @PostMapping("/{liveSeq}/like")
    public ResponseEntity<ResponseDTO<Boolean>> toggleLike(
            @PathVariable Integer liveSeq,
            @AuthenticationPrincipal Integer userSeq){

        boolean isLiked = liveService.toggleLike(liveSeq, userSeq);
        return ResponseDTO.ok(isLiked, isLiked ? "좋아요를 눌렀습니다." : "좋아요를 취소했습니다.");

    }

    /**
     * 라이브 방송 채팅 내역 조회
     */
    @Operation(
            summary = "라이브 방송 채팅 내역 조회",
            description = """
                해당 라이브 방송에서 발생한 채팅 메시지 내역을 조회합니다.
                
                - 최신 메시지부터 역순으로 최대 `limit` 개 응답합니다.
                - 기본 limit = 50
                """,
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "채팅 내역 조회 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ResponseDTO.class),
                            examples = @ExampleObject(
                                    name = "채팅 내역 조회 성공",
                                    value = """
                                {
                                  "status": 200,
                                  "message": "채팅 내역을 조회했습니다.",
                                  "data": [
                                    {
                                      "liveSeq": 1,
                                      "senderSeq": 3,
                                      "senderName": "이영희",
                                      "content": "안녕하세요!",
                                      "sentAt": "2025-11-07T10:31:25"
                                    },
                                    {
                                      "liveSeq": 1,
                                      "senderSeq": 5,
                                      "senderName": "김철수",
                                      "content": "와 진짜 이 집 좋아보인다",
                                      "sentAt": "2025-11-07T10:31:27"
                                    }
                                  ]
                                }
                                """
                            )
                    )
            )
    })
    @GetMapping("/{liveSeq}/chat")
    public ResponseEntity<ResponseDTO<List<LiveChatMessageResponseDto>>> getChatHistory(
            @PathVariable Integer liveSeq,
            @RequestParam(defaultValue = "50") int limit) {

        List<LiveChatMessageResponseDto> response = liveChatService.getChatHistory(liveSeq, limit);
        return ResponseDTO.ok(response, "채팅 내역을 조회했습니다.");
    }

}
