package ssafy.a303.backend.chat.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ssafy.a303.backend.chat.dto.request.ChatRoomCreateRequestDto;
import ssafy.a303.backend.chat.dto.response.ChatMessageResponseDto;
import ssafy.a303.backend.chat.dto.response.ChatRoomResponseDto;
import ssafy.a303.backend.chat.dto.response.MyChatListResponseDto;
import ssafy.a303.backend.chat.service.ChatService;
import ssafy.a303.backend.common.response.ResponseDTO;

import java.util.List;

@RestController
@RequestMapping("/api/v1/chat")
@RequiredArgsConstructor
@Log4j2
public class ChatController {

    private final ChatService chatService;

    /**
     * 1:1 채팅방 생성 또는 기존 방 반환
     */
    @PostMapping("/room")
    public ResponseEntity<ResponseDTO<ChatRoomResponseDto>> createOrGetRoom(
            @RequestBody ChatRoomCreateRequestDto requestDto) {

        log.info("[CHAT][CREATE] propertySeq={}, isAucPref={}",
                requestDto.getPropertySeq(), requestDto.isAucPref());

        ChatRoomResponseDto response = chatService.createOrGetRoom(requestDto);

        // new 상태에 따라 메시지 변경
        String message = response.isNew()
                ? "새로운 채팅방이 생성되었습니다."
                : "기존 채팅방으로 이동합니다.";

        return ResponseDTO.ok(response, message);
    }

    /**
     * 내 채팅방 목록 조회
     */
    @GetMapping("/my/rooms")
    public ResponseEntity<ResponseDTO<List<MyChatListResponseDto>>> getMyChatRooms() {
        List<MyChatListResponseDto> rooms = chatService.getMyChatRooms();
        return ResponseDTO.ok(rooms, "내 채팅 목록을 불러왔습니다.");
    }

    /**
     * 특정 채팅방 메시지 기록 조회
     */
    @GetMapping("/room/{roomSeq}/history")
    public ResponseEntity<ResponseDTO<List<ChatMessageResponseDto>>> getChatHistory(
            @PathVariable Integer roomSeq) {

        List<ChatMessageResponseDto> messages = chatService.getChatHistory(roomSeq);
        return ResponseDTO.ok(messages, "채팅 내역을 불러왔습니다.");
    }

    /**
     * 해당 채팅방 메시지 읽음처리
     */
    @PostMapping("/room/{roomSeq}/read")
    public ResponseEntity<ResponseDTO<Void>> readMessages(@PathVariable Integer roomSeq) {
        chatService.readMessages(roomSeq);
        return ResponseDTO.ok(null, "읽음 처리 완료되었습니다.");
    }

    /**
     * 채팅방 나가기
     */
    @DeleteMapping("room/{roomId}/leave")
    public ResponseEntity<ResponseDTO<Void>> leaveRoom(@PathVariable Integer roomId) {
         chatService.leaveRoom(roomId);
         return ResponseDTO.ok(null, "채팅방에서 정상적으로 퇴장하였습니다.");
    }
}
