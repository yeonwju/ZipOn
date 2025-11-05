package ssafy.a303.backend.common.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import ssafy.a303.backend.chat.dto.request.ChatMessageRequestDto;
import ssafy.a303.backend.chat.dto.response.ChatMessageResponseDto;
import ssafy.a303.backend.chat.service.ChatRedisPubSubService;
import ssafy.a303.backend.chat.service.ChatService;
import ssafy.a303.backend.common.exception.CustomException;
import ssafy.a303.backend.common.response.ErrorCode;
import ssafy.a303.backend.livestream.dto.request.LiveChatMessageRequestDto;
import ssafy.a303.backend.livestream.dto.response.LiveChatMessageResponseDto;
import ssafy.a303.backend.livestream.service.LiveRedisPubSubService;
import ssafy.a303.backend.livestream.service.LiveService;
import ssafy.a303.backend.user.entity.User;
import ssafy.a303.backend.user.repository.UserRepository;

/**
 * StompController (WebSocket 메시지 처리 컨트롤러)
 * =================================================================================================
 * 역할
 *  - 클라이언트가 STOMP 프로토콜을 통해 `/pub/**` 경로로 전송한 메시지를 수신
 *  - Redis Pub/Sub 기반으로 `/sub/**` 경로를 구독 중인 클라이언트에게 실시간으로 브로드캐스트
 *
 * 주요 경로
 *  - 1:1 채팅   → /pub/chat/{roomSeq} 발행, /sub/chat/{roomSeq} 구독
 *  - 라이브 채팅 → /pub/live/{liveSeq} 발행, /sub/live/{liveSeq} 구독
 *
 * STOMP 메시지 동작 흐름
 *  1) 클라이언트가 /pub 경로로 메시지를 보낸다.
 *  2) 서버는 @MessageMapping 메서드로 해당 메시지를 수신한다.
 *  3) DB에 저장한 후 Redis Pub/Sub 채널을 통해 /sub 경로 구독자에게 브로드캐스트한다.
 *
 * 인증 처리
 *  - CONNECT 시 JWT 인증 검증은 StompHandler에서 수행된다.
 *  - SUBSCRIBE 시 접근 권한(방 참여 여부 등)을 확인할 수 있다.
 *  - SEND(@MessageMapping 실행 시) 현재 로그인 사용자는 SecurityContextHolder에서 가져온다.
 * =================================================================================================
 */
@Controller
@Log4j2
public class StompController {

    private final ChatService chatService;
    private final ChatRedisPubSubService chatRedisPubSubService;
    private final LiveService liveService;
    private final LiveRedisPubSubService liveRedisPubSubService;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;
    
    // 생성자 주입
    public StompController(ChatService chatService, 
                          ChatRedisPubSubService chatRedisPubSubService,
                          LiveService liveService,
                          LiveRedisPubSubService liveRedisPubSubService,
                          UserRepository userRepository) {
        this.chatService = chatService;
        this.chatRedisPubSubService = chatRedisPubSubService;
        this.liveService = liveService;
        this.liveRedisPubSubService = liveRedisPubSubService;
        this.userRepository = userRepository;
        
        // ObjectMapper에 JavaTimeModule 등록
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
    }

    // =================================================================================================
    // 1:1 채팅 메시지 처리
    // =================================================================================================
    @MessageMapping("/chat/{roomSeq}")
    public void sendChatMessage(
            @DestinationVariable Integer roomSeq,
            ChatMessageRequestDto requestDto,
            @org.springframework.messaging.handler.annotation.Header("Authorization") String authHeader
    ) throws JsonProcessingException {

        log.info("[CHAT] roomSeq={}, content={}", roomSeq, requestDto.getContent());

        // Authorization 헤더에서 토큰 추출
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new CustomException(ErrorCode.INVALID_AUTH_HEADER);
        }
        
        String token = authHeader.substring(7);
        
        // 토큰에서 userSeq 추출 (간단한 방법: JWT 파싱)
        Integer userSeq;
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3) {
                throw new CustomException(ErrorCode.INVALID_TOKEN);
            }
            
            // Payload 디코딩
            String payload = new String(java.util.Base64.getUrlDecoder().decode(parts[1]));
            com.fasterxml.jackson.databind.JsonNode node = new com.fasterxml.jackson.databind.ObjectMapper().readTree(payload);
            userSeq = node.get("sub").asInt();
            
            log.info("[CHAT] 토큰에서 userSeq 추출: {}", userSeq);
        } catch (Exception e) {
            log.error("[CHAT] 토큰 파싱 오류: {}", e.getMessage());
            throw new CustomException(ErrorCode.INVALID_TOKEN);
        }

        User sender = userRepository.findById(userSeq)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // 2. DB 저장 및 응답 DTO 생성
        ChatMessageResponseDto response = chatService.saveMessage(roomSeq, requestDto, sender);

        // 3. DTO → JSON 문자열 변환
        String payload = objectMapper.writeValueAsString(response);

        // 4. Redis Pub/Sub 채널로 메시지 발행
        chatRedisPubSubService.publish("chat:" + roomSeq, payload);

        log.info("[REDIS][CHAT] roomSeq={}, sender={}, message={}",
                roomSeq, sender.getNickname(), response.getContent());
    }

    // =================================================================================================
    // 라이브 방송 채팅 메시지 처리
    // =================================================================================================
    @MessageMapping("/live/{liveSeq}")
    public void sendLiveMessage(
            @DestinationVariable Integer liveSeq,
            LiveChatMessageRequestDto requestDto
    ) throws JsonProcessingException {

        log.info("[LIVE] liveSeq={}, content={}", liveSeq, requestDto.getContent());

        // 사용자 조회 방식 동일하게 변경
        String userSeqString = SecurityContextHolder.getContext().getAuthentication().getName();
        Integer userSeq = Integer.valueOf(userSeqString);

        User sender = userRepository.findById(userSeq)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        LiveChatMessageResponseDto response =
                liveService.buildResponse(requestDto, sender.getUserSeq(), sender.getNickname());

        String payload = objectMapper.writeValueAsString(response);

        liveRedisPubSubService.publish("live:" + liveSeq, payload);

        log.info("[REDIS][LIVE] liveSeq={}, sender={}, message={}",
                liveSeq, sender.getNickname(), response.getContent());
    }
}
