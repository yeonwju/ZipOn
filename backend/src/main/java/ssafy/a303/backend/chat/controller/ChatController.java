package ssafy.a303.backend.chat.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import ssafy.a303.backend.chat.dto.request.ChatRoomCreateRequestDto;
import ssafy.a303.backend.chat.dto.response.ChatMessageResponseDto;
import ssafy.a303.backend.chat.dto.response.ChatRoomResponseDto;
import ssafy.a303.backend.chat.dto.response.MyChatListResponseDto;
import ssafy.a303.backend.chat.service.ChatService;
import ssafy.a303.backend.common.response.ResponseDTO;

import java.util.List;

@Tag(name = "채팅")
@RestController
@RequestMapping("/api/v1/chat")
@RequiredArgsConstructor
@Log4j2
public class ChatController {

    private final ChatService chatService;

    /**
     * 1:1 채팅방 생성 또는 기존 방 반환
     */
    @Operation(
            summary = "1:1 채팅방 생성",
            description = "매물에 대한 1:1 채팅방을 생성하거나 기존 채팅방을 반환합니다.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "채팅방 생성/조회 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ChatRoomResponseDto.class),
                            examples = @ExampleObject(
                                    name = "채팅방 생성 성공",
                                    value = """
                    {
                      "status": 200,
                      "message": "새로운 채팅방이 생성되었습니다.",
                      "data": {
                        "roomSeq": 1,
                        "isNew": true,
                        "opponent": {
                          "userSeq": 2,
                          "name": "홍길동",
                          "nickname": "집주인",
                          "profileImg": "https://s3.amazonaws.com/bucket/profile.jpg"
                        }
                      }
                    }
                    """
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "잘못된 요청",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ChatRoomResponseDto.class),
                            examples = @ExampleObject(
                                    name = "잘못된 요청",
                                    value = """
                    {
                      "status": 400,
                      "message": "유효하지 않은 매물 정보입니다."
                    }
                    """
                            )
                    )
            )
    })
    @PostMapping("/room")
    public ResponseEntity<ResponseDTO<ChatRoomResponseDto>> createOrGetRoom(
            @RequestBody ChatRoomCreateRequestDto requestDto,
            @AuthenticationPrincipal Integer userSeq) {

        log.info("[CHAT][CREATE] userSeq={}, propertySeq={}, isAucPref={}",
                userSeq, requestDto.getPropertySeq(), requestDto.getAucPref());

        ChatRoomResponseDto response = chatService.createOrGetRoom(requestDto, userSeq);

        // new 상태에 따라 메시지 변경
        String message = response.getNewRoom()
                ? "새로운 채팅방이 생성되었습니다."
                : "기존 채팅방으로 이동합니다.";

        return ResponseDTO.ok(response, message);
    }

    /**
     * 내 채팅방 목록 조회
     */
    @Operation(
            summary = "내 채팅방 목록 조회",
            description = "로그인한 사용자의 전체 채팅방 목록을 조회합니다.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "조회 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = MyChatListResponseDto.class),
                            examples = @ExampleObject(
                                    name = "채팅방 목록 조회 성공",
                                    value = """
                    {
                      "status": 200,
                      "message": "내 채팅 목록을 불러왔습니다.",
                      "data": [
                        {
                          "roomSeq": 1,
                          "partner": {
                            "userSeq": 2,
                            "name": "홍길동",
                            "nickname": "집주인",
                            "profileImg": "https://s3.amazonaws.com/bucket/profile.jpg"
                          },
                          "lastMessage": {
                            "content": "안녕하세요",
                            "sentAt": "2025-11-06T10:30:00"
                          },
                          "unreadCount": 3
                        }
                      ]
                    }
                    """
                            )
                    )
            )
    })
    @GetMapping("/my/rooms")
    public ResponseEntity<ResponseDTO<List<MyChatListResponseDto>>> getMyChatRooms(
            @AuthenticationPrincipal Integer userSeq) {
        List<MyChatListResponseDto> rooms = chatService.getMyChatRooms(userSeq);
        return ResponseDTO.ok(rooms, "내 채팅 목록을 불러왔습니다.");
    }

    /**
     * 특정 채팅방 메시지 기록 조회
     */
    @Operation(
            summary = "채팅방 메시지 기록 조회",
            description = "특정 채팅방의 전체 메시지 기록을 조회합니다.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "조회 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ChatMessageResponseDto.class),
                            examples = @ExampleObject(
                                    name = "채팅 내역 조회 성공",
                                    value = """
                                {
                                  "status": 200,
                                  "message": "채팅 내역을 불러왔습니다.",
                                  "data": [
                                    {
                                      "messageSeq": 1,
                                      "roomSeq": 1,
                                      "sender": {
                                        "userSeq": 2,
                                        "name": "홍길동",
                                        "nickname": "집주인",
                                        "profileImg": "https://s3.amazonaws.com/bucket/profile.jpg"
                                      },
                                      "content": "안녕하세요",
                                      "sentAt": "2025-11-06T10:30:00"
                                    }
                                  ]
                                }
                                """
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "채팅방을 찾을 수 없음",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ChatMessageResponseDto.class),
                            examples = @ExampleObject(
                                    name = "채팅방 없음",
                                    value = """
                    {
                      "status": 404,
                      "message": "채팅방을 찾을 수 없습니다."
                    }
                    """
                            )
                    )
            )
    })
    @GetMapping("/room/{roomSeq}/history")
    public ResponseEntity<ResponseDTO<List<ChatMessageResponseDto>>> getChatHistory(
            @PathVariable Integer roomSeq) {

        List<ChatMessageResponseDto> messages = chatService.getChatHistory(roomSeq);
        return ResponseDTO.ok(messages, "채팅 내역을 불러왔습니다.");
    }

    /**
     * 해당 채팅방 메시지 읽음처리
     */
    @Operation(
            summary = "채팅방 메시지 읽음 처리",
            description = "특정 채팅방의 읽지 않은 메시지를 모두 읽음 처리합니다.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "읽음 처리 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ResponseDTO.class),
                            examples = @ExampleObject(
                                    name = "읽음 처리 성공",
                                    value = """
                    {
                      "status": 200,
                      "message": "읽음 처리 완료되었습니다."
                    }
                    """
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "채팅방을 찾을 수 없음",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ResponseDTO.class),
                            examples = @ExampleObject(
                                    name = "채팅방 없음",
                                    value = """
                    {
                      "status": 404,
                      "message": "채팅방을 찾을 수 없습니다."
                    }
                    """
                            )
                    )
            )
    })
    @PostMapping("/room/{roomSeq}/read")
    public ResponseEntity<ResponseDTO<Void>> readMessages(
            @PathVariable Integer roomSeq,
            @AuthenticationPrincipal Integer userSeq) {
        chatService.readMessages(roomSeq, userSeq);
        return ResponseDTO.ok(null, "읽음 처리 완료되었습니다.");
    }

    /**
     * 채팅방 나가기
     */
    @Operation(
            summary = "채팅방 나가기",
            description = "채팅방에서 퇴장합니다.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "퇴장 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ResponseDTO.class),
                            examples = @ExampleObject(
                                    name = "퇴장 성공",
                                    value = """
                    {
                      "status": 200,
                      "message": "채팅방에서 정상적으로 퇴장하였습니다."
                    }
                    """
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "채팅방을 찾을 수 없음",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ResponseDTO.class),
                            examples = @ExampleObject(
                                    name = "채팅방 없음",
                                    value = """
                    {
                      "status": 404,
                      "message": "채팅방을 찾을 수 없습니다."
                    }
                    """
                            )
                    )
            )
    })
    @DeleteMapping("room/{roomId}/leave")
    public ResponseEntity<ResponseDTO<Void>> leaveRoom(
            @PathVariable Integer roomId,
            @AuthenticationPrincipal Integer userSeq) {
         chatService.leaveRoom(roomId, userSeq);
         return ResponseDTO.ok(null, "채팅방에서 정상적으로 퇴장하였습니다.");
    }
}
